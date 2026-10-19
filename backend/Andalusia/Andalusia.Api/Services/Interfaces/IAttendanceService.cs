using Andalusia.Api.DTOs.Requests;
using Andalusia.Api.DTOs.Responses;

namespace Andalusia.Api.Services.Interfaces
{
    public interface IAttendanceService
    {
        Task<SessionAttendanceDto> GetSessionAttendanceAsync(int instructorId, int sessionId);
        Task<SessionAttendanceDto> MarkAttendanceAsync(int instructorId, int sessionId, MarkAttendanceRequestDto dto);
    }
}