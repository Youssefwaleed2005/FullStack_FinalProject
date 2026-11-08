using Andalusia.Api.DTOs.Requests;
using Andalusia.Api.DTOs.Responses;
using Andalusia.Api.Exceptions;
using Andalusia.Api.Mapping;
using Andalusia.Api.Models;
using Andalusia.Api.Repos.Interfaces;
using Andalusia.Api.Services.Interfaces;
using System.Security.Cryptography;
using System.Text;

namespace Andalusia.Api.Services
{
    public class AuthService : IAuthService
    {
        private const string DefaultRole = "Learner";

        private const long MaxPhotoBytes = 2 * 1024 * 1024; // 2 MB
        private static readonly HashSet<string> AllowedPhotoTypes = new(StringComparer.OrdinalIgnoreCase)
        {
            ".png", ".jpg", ".jpeg", ".webp"
        };

        private readonly IUserRepository _userRepository;
        private readonly ITokenService _tokenService;
        private readonly IWebHostEnvironment _environment;
        private readonly ILogger<AuthService> _logger;

        public AuthService(
            IUserRepository userRepository,
            ITokenService tokenService,
            IWebHostEnvironment environment,
            ILogger<AuthService> logger)
        {
            _userRepository = userRepository;
            _tokenService = tokenService;
            _environment = environment;
            _logger = logger;
        }

        // ---------- Passwords ----------

        public async Task ChangePasswordAsync(int userId, ChangePasswordRequestDto dto)
        {
            var user = await _userRepository.GetByIdAsync(userId)
                ?? throw new NotFoundException("User not found.");

            if (!VerifyPassword(dto.CurrentPassword, user.PasswordHash))
                throw new BadRequestException("Your current password is not correct.");

            if (dto.CurrentPassword == dto.NewPassword)
                throw new BadRequestException("Choose a new password that is different from the current one.");

            user.PasswordHash = BCrypt.Net.BCrypt.HashPassword(dto.NewPassword);
            _userRepository.Update(user);
            await _userRepository.SaveChangesAsync();
        }

        // Creates a one-time token valid for 30 minutes. There is no email service, so in Development
        // the reset link is written to the console and returned in the response for the demo.
        public async Task<ForgotPasswordResponseDto> ForgotPasswordAsync(ForgotPasswordRequestDto dto, string resetPageUrl)
        {
            var response = new ForgotPasswordResponseDto
            {
                Message = "If an account exists for this email, a reset link has been sent."
            };

            var user = await _userRepository.GetByEmailAsync(dto.Email.Trim());
            if (user == null || !user.IsActive)
                return response;

            var token = Convert.ToHexString(RandomNumberGenerator.GetBytes(32));
            user.PasswordResetTokenHash = HashToken(token);
            user.PasswordResetExpiresAt = DateTime.UtcNow.AddMinutes(30);
            _userRepository.Update(user);
            await _userRepository.SaveChangesAsync();

            var link = $"{resetPageUrl}?email={Uri.EscapeDataString(user.Email)}&token={token}";
            _logger.LogInformation("Password reset link for {Email}: {Link}", user.Email, link);

            if (_environment.IsDevelopment())
                response.DevResetLink = link;

            return response;
        }

        public async Task ResetPasswordAsync(ResetPasswordRequestDto dto)
        {
            var user = await _userRepository.GetByEmailAsync(dto.Email.Trim());

            var valid = user != null
                && user.PasswordResetTokenHash != null
                && user.PasswordResetExpiresAt > DateTime.UtcNow
                && CryptographicOperations.FixedTimeEquals(
                    Encoding.UTF8.GetBytes(user.PasswordResetTokenHash),
                    Encoding.UTF8.GetBytes(HashToken(dto.Token.Trim())));

            if (!valid)
                throw new BadRequestException("This reset link is invalid or has expired. Ask for a new one.");

            user!.PasswordHash = BCrypt.Net.BCrypt.HashPassword(dto.NewPassword);
            user.PasswordResetTokenHash = null;
            user.PasswordResetExpiresAt = null;
            _userRepository.Update(user);
            await _userRepository.SaveChangesAsync();
        }

        private static string HashToken(string token) =>
            Convert.ToHexString(SHA256.HashData(Encoding.UTF8.GetBytes(token)));

        // ---------- Profile photo ----------

        public async Task<UserProfileResponseDto> UploadPhotoAsync(int userId, IFormFile file)
        {
            if (file.Length == 0)
                throw new BadRequestException("The file is empty.");
            if (file.Length > MaxPhotoBytes)
                throw new BadRequestException("The photo is too big. The maximum is 2 MB.");

            var extension = Path.GetExtension(file.FileName);
            if (!AllowedPhotoTypes.Contains(extension))
                throw new BadRequestException("Use a PNG, JPG or WEBP image.");

            var user = await _userRepository.GetByIdWithRolesAsync(userId)
                ?? throw new NotFoundException("User not found.");

            var webRoot = _environment.WebRootPath ?? Path.Combine(_environment.ContentRootPath, "wwwroot");
            var folder = Path.Combine(webRoot, "uploads", "avatars");
            Directory.CreateDirectory(folder);
            var fileName = $"{Guid.NewGuid():N}{extension.ToLowerInvariant()}";

            await using (var stream = File.Create(Path.Combine(folder, fileName)))
            {
                await file.CopyToAsync(stream);
            }

            // Remove the previous uploaded photo so old files don't pile up
            if (user.PhotoUrl?.StartsWith("/uploads/avatars/") == true)
            {
                var oldPath = Path.Combine(folder, Path.GetFileName(user.PhotoUrl));
                if (File.Exists(oldPath)) File.Delete(oldPath);
            }

            user.PhotoUrl = $"/uploads/avatars/{fileName}";
            _userRepository.Update(user);
            await _userRepository.SaveChangesAsync();

            return user.ToProfileDto();
        }

        public async Task<AuthResponseDto> RegisterAsync(RegisterRequestDto dto)
        {
            if (!dto.AcceptedTerms)
                throw new BadRequestException("You must accept the terms and conditions.");

            if (await _userRepository.EmailExistsAsync(dto.Email))
                throw new ConflictException("An account with this email already exists.");

            var learnerRole = await _userRepository.GetRoleByNameAsync(DefaultRole)
                ?? throw new NotFoundException($"The '{DefaultRole}' role is missing. Seed the database first.");

            var user = dto.ToEntity();
            user.PasswordHash = BCrypt.Net.BCrypt.HashPassword(dto.Password);
            user.UserRoles.Add(new UserRole { Role = learnerRole });

            await _userRepository.AddAsync(user);
            await _userRepository.SaveChangesAsync();

            return BuildAuthResponse(user);
        }

        public async Task<AuthResponseDto> LoginAsync(LoginRequestDto dto)
        {
            var user = await _userRepository.GetByEmailAsync(dto.Email);

            // Same message whether the email is unknown or the password is wrong —
            // distinguishing them leaks which emails are registered.
            if (user == null || !VerifyPassword(dto.Password, user.PasswordHash))
                throw new UnauthorizedException("Invalid email or password.");

            if (!user.IsActive)
                throw new UnauthorizedException("This account has been deactivated.");

            return BuildAuthResponse(user);
        }

        public async Task<UserProfileResponseDto> GetProfileAsync(int userId)
        {
            var user = await _userRepository.GetByIdWithRolesAsync(userId)
                ?? throw new NotFoundException("User not found.");

            return user.ToProfileDto();
        }

        public async Task<UserProfileResponseDto> UpdateProfileAsync(int userId, UpdateProfileRequestDto dto)
        {
            var user = await _userRepository.GetByIdWithRolesAsync(userId)
                ?? throw new NotFoundException("User not found.");

            dto.UpdateEntity(user);

            _userRepository.Update(user);
            await _userRepository.SaveChangesAsync();

            return user.ToProfileDto();
        }

        private AuthResponseDto BuildAuthResponse(User user)
        {
            var roles = user.UserRoles.Select(ur => ur.Role.Name).ToList();
            var (token, expiresAt) = _tokenService.CreateToken(user, roles);

            return new AuthResponseDto
            {
                Token = token,
                ExpiresAt = expiresAt,
                User = user.ToSummaryDto()
            };
        }

        private static bool VerifyPassword(string password, string hash)
        {
            try
            {
                return BCrypt.Net.BCrypt.Verify(password, hash);
            }
            catch (BCrypt.Net.SaltParseException)
            {
                // Hash was not produced by BCrypt (e.g. an old PasswordHasher value).
                return false;
            }
        }
    }
}