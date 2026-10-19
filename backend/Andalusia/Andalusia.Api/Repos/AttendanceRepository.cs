using Andalusia.Api.Data;
using Andalusia.Api.Models;
using Andalusia.Api.Repos.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace Andalusia.Api.Repos
{
    public class AttendanceRepository : GenericRepository<Attendance>, IAttendanceRepository
    {
        public AttendanceRepository(AppDbContext context) : base(context) { }

        public async Task<List<Attendance>> GetBySessionAsync(int sessionId)
        {
            return await _dbSet
                .Where(a => a.SessionId == sessionId)
                .ToListAsync();
        }
    }
}