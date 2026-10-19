using Andalusia.Api.DTOs.Requests;
using Andalusia.Api.DTOs.Responses;

namespace Andalusia.Api.Services.Interfaces
{
    public interface ISessionService
    {
        Task<List<SessionResponseDto>> GetByCourseAsync(int instructorId, int courseId);
        Task<SessionResponseDto> CreateAsync(int instructorId, int courseId, SessionRequestDto dto);
        Task<SessionResponseDto> UpdateAsync(int instructorId, int sessionId, SessionRequestDto dto);
        Task DeleteAsync(int instructorId, int sessionId);
    }
}