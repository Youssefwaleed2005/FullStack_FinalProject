using Andalusia.Api.Data;
using Andalusia.Api.Models;
using Andalusia.Api.Repos.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace Andalusia.Api.Repos
{
    public class SessionRepository : GenericRepository<Session>, ISessionRepository
    {
        public SessionRepository(AppDbContext context) : base(context) { }

        public async Task<List<Session>> GetByCourseAsync(int courseId)
        {
            return await _dbSet
                .AsNoTracking()
                .Include(s => s.Attendances)
                .Where(s => s.CourseId == courseId)
                .OrderBy(s => s.StartTime)
                .ToListAsync();
        }

        public async Task<bool> HasAttendanceAsync(int sessionId)
        {
            return await _context.Attendances.AnyAsync(a => a.SessionId == sessionId);
        }
    }
}