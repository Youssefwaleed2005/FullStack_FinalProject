using Andalusia.Api.DTOs.Requests;
using Andalusia.Api.DTOs.Responses;
using Andalusia.Api.Enums;

namespace Andalusia.Api.Services.Interfaces
{
    public interface IPartnerService
    {
        Task<IEnumerable<PartnerResponseDto>> GetActiveAsync(PartnerType? type, int? take);
        Task<PartnerResponseDto> GetByIdAsync(int id);
        Task<PartnerResponseDto> CreateAsync(PartnerRequestDto dto);
        Task<PartnerResponseDto> UpdateAsync(int id, PartnerRequestDto dto);
        Task DeleteAsync(int id);
    }
}