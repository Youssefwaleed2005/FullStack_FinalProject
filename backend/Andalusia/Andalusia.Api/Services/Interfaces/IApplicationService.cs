using Andalusia.Api.DTOs.Requests;
using Andalusia.Api.DTOs.Responses;

namespace Andalusia.Api.Services.Interfaces
{
    public interface IApplicationService
    {
        Task<ApplicationResponseDto> CreateAsync(int userId, CreateApplicationRequestDto dto);
        Task<IEnumerable<ApplicationResponseDto>> GetMyApplicationsAsync(int userId);
    }
}