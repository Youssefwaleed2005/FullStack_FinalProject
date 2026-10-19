using Andalusia.Api.Data;
using Andalusia.Api.Models;
using Andalusia.Api.Repos.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace Andalusia.Api.Repos
{
    public class MaterialRepository : GenericRepository<Material>, IMaterialRepository
    {
        public MaterialRepository(AppDbContext context) : base(context) { }

        // Newest first
        public async Task<List<Material>> GetByCourseAsync(int courseId)
        {
            return await _dbSet
                .AsNoTracking()
                .Where(m => m.CourseId == courseId)
                .OrderByDescending(m => m.CreatedAt)
                .ToListAsync();
        }
    }
}