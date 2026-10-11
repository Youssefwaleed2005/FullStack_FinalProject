using Andalusia.Api.Data;
using Andalusia.Api.Enums;
using Andalusia.Api.Models;
using Andalusia.Api.Repos.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace Andalusia.Api.Repos
{
    public class ApplicationRepository : GenericRepository<Application>, IApplicationRepository
    {
       
        private static readonly ApplicationStatus[] ActiveStatuses =
        {
            ApplicationStatus.Submitted,
            ApplicationStatus.Accepted
        };

        public ApplicationRepository(AppDbContext context) : base(context) { }

        public async Task<IEnumerable<Application>> GetByUserAsync(int userId)
        {
            return await _dbSet
                .AsNoTracking()
                .Include(a => a.Course)
                .Include(a => a.Program)
                .Where(a => a.UserId == userId)
                .OrderByDescending(a => a.CreatedAt)
                .ToListAsync();
        }

        public async Task<Application?> GetByIdWithTargetAsync(int id)
        {
            return await _dbSet
                .AsNoTracking()
                .Include(a => a.Course)
                .Include(a => a.Program)
                .FirstOrDefaultAsync(a => a.Id == id);
        }

        public async Task<bool> HasActiveApplicationAsync(int userId, int? courseId, int? programId)
        {
            var applications = _dbSet.Where(a =>
                a.UserId == userId && ActiveStatuses.Contains(a.Status));

            if (courseId.HasValue)
                return await applications.AnyAsync(a => a.CourseId == courseId.Value);

            return await applications.AnyAsync(a => a.ProgramId == programId);
        }
    }
}