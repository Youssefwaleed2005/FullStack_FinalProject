using Andalusia.Api.DTOs.Requests;
using Andalusia.Api.DTOs.Responses;
using Andalusia.Api.Exceptions;
using Andalusia.Api.Mapping;
using Andalusia.Api.Models;
using Andalusia.Api.Repos.Interfaces;
using Andalusia.Api.Services.Interfaces;

namespace Andalusia.Api.Services
{
    public class AuthService : IAuthService
    {
        private const string DefaultRole = "Learner";

        private readonly IUserRepository _userRepository;
        private readonly ITokenService _tokenService;

        public AuthService(IUserRepository userRepository, ITokenService tokenService)
        {
            _userRepository = userRepository;
            _tokenService = tokenService;
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