using Andalusia.Api.Data;
using Andalusia.Api.Models;
using Andalusia.Api.Repos.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace Andalusia.Api.Repos
{
    public class EnrollmentRepository : GenericRepository<Enrollment>, IEnrollmentRepository
    {
        public EnrollmentRepository(AppDbContext context) : base(context) { }

        public async Task<IEnumerable<Enrollment>> GetByUserAsync(int userId)
        {
            return await _dbSet
                .AsNoTracking()
                .Include(e => e.Application).ThenInclude(a => a.Course)
                .Include(e => e.Application).ThenInclude(a => a.Program)
                .Where(e => e.Application.UserId == userId)
                .OrderByDescending(e => e.EnrolledAt)
                .ToListAsync();
        }
    }
}