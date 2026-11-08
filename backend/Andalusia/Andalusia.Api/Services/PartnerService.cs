using Andalusia.Api.DTOs.Requests;
using Andalusia.Api.DTOs.Responses;
using Andalusia.Api.Enums;
using Andalusia.Api.Exceptions;
using Andalusia.Api.Mapping;
using Andalusia.Api.Repos.Interfaces;
using Andalusia.Api.Services.Interfaces;

namespace Andalusia.Api.Services
{
    public class PartnerService : IPartnerService
    {
        private const long MaxLogoBytes = 2 * 1024 * 1024; // 2 MB
        private static readonly HashSet<string> AllowedLogoTypes = new(StringComparer.OrdinalIgnoreCase)
        {
            ".png", ".jpg", ".jpeg", ".webp", ".svg"
        };

        private readonly IPartnerRepository _repo;
        private readonly IWebHostEnvironment _environment;

        public PartnerService(IPartnerRepository repo, IWebHostEnvironment environment)
        {
            _repo = repo;
            _environment = environment;
        }

        public async Task<UploadedFileDto> UploadLogoAsync(IFormFile file)
        {
            if (file.Length == 0)
                throw new BadRequestException("The file is empty.");
            if (file.Length > MaxLogoBytes)
                throw new BadRequestException("The logo is too big. The maximum is 2 MB.");

            var extension = Path.GetExtension(file.FileName);
            if (!AllowedLogoTypes.Contains(extension))
                throw new BadRequestException("Use a PNG, JPG, WEBP or SVG image for the logo.");

            // Random name, so logos never overwrite each other
            var webRoot = _environment.WebRootPath ?? Path.Combine(_environment.ContentRootPath, "wwwroot");
            var folder = Path.Combine(webRoot, "uploads", "partners");
            Directory.CreateDirectory(folder);
            var fileName = $"{Guid.NewGuid():N}{extension.ToLowerInvariant()}";

            await using (var stream = File.Create(Path.Combine(folder, fileName)))
            {
                await file.CopyToAsync(stream);
            }

            return new UploadedFileDto { Url = $"/uploads/partners/{fileName}" };
        }

        public async Task<IEnumerable<PartnerResponseDto>> GetActiveAsync(PartnerType? type, int? take)
        {
            var partners = await _repo.GetActiveAsync(type, take);
            return partners.Select(p => p.ToResponseDto());
        }

        public async Task<PartnerResponseDto> GetByIdAsync(int id)
        {
            var partner = await _repo.GetByIdAsync(id)
                ?? throw new NotFoundException($"Partner {id} not found");
            return partner.ToResponseDto();
        }

        public async Task<PartnerResponseDto> CreateAsync(PartnerRequestDto dto)
        {
            var partner = dto.ToEntity();
            await _repo.AddAsync(partner);
            await _repo.SaveChangesAsync();
            return partner.ToResponseDto();
        }

        public async Task<PartnerResponseDto> UpdateAsync(int id, PartnerRequestDto dto)
        {
            var partner = await _repo.GetByIdAsync(id)
                ?? throw new NotFoundException($"Partner {id} not found");
            dto.UpdateEntity(partner);
            await _repo.SaveChangesAsync();
            return partner.ToResponseDto();
        }

        public async Task DeleteAsync(int id)
        {
            var partner = await _repo.GetByIdAsync(id)
                ?? throw new NotFoundException($"Partner {id} not found");
            // Soft delete: the global query filter hides it everywhere from now on
            partner.IsDeleted = true;
            partner.IsActive = false;
            partner.DeletedAt = DateTime.UtcNow;
            _repo.Update(partner);
            await _repo.SaveChangesAsync();
        }

        public async Task<IEnumerable<PartnerAdminResponseDto>> GetAllForAdminAsync()
        {
            var partners = await _repo.GetAllForAdminAsync();
            return partners.Select(p => p.ToAdminResponseDto());
        }
    }
}