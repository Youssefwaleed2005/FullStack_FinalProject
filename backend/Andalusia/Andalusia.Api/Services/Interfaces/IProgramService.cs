using Andalusia.Api.DTOs.Requests;
using Andalusia.Api.DTOs.Responses;

namespace Andalusia.Api.Services.Interfaces
{
    public interface IProgramService
    {
        Task<PagedResponse<ProgramResponseDto>> GetAllAsync(ProgramQueryParameters query);
        Task<ProgramDetailsResponseDto> GetByIdAsync(int id);
        Task<ProgramDetailsResponseDto> CreateAsync(ProgramRequestDto dto);
        Task<ProgramDetailsResponseDto> UpdateAsync(int id, ProgramRequestDto dto);
        Task DeleteAsync(int id);
    }
}