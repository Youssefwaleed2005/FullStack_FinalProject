using Andalusia.Api.Models;

namespace Andalusia.Api.Repos.Interfaces
{
    public interface ISessionRepository : IGenericRepository<Session>
    {
        Task<List<Session>> GetByCourseAsync(int courseId);
        Task<bool> HasAttendanceAsync(int sessionId);
    }
}