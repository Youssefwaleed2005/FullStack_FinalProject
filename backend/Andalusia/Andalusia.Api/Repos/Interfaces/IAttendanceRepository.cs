using Andalusia.Api.Models;

namespace Andalusia.Api.Repos.Interfaces
{
    public interface IAttendanceRepository : IGenericRepository<Attendance>
    {
        // Tracked, so the service can update existing rows
        Task<List<Attendance>> GetBySessionAsync(int sessionId);
    }
}