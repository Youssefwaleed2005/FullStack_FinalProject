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
        private readonly IPartnerRepository _repo;

        public PartnerService(IPartnerRepository repo)
        {
            _repo = repo;
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
            _repo.Delete(partner);
            await _repo.SaveChangesAsync();
        }
    }
}