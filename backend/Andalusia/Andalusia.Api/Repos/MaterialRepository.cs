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

        // Learners' "done" marks must go before the material itself (FKs are Restrict)
        public async Task RemoveCompletionsAsync(int materialId)
        {
            var completions = await _context.MaterialCompletions
                .Where(c => c.MaterialId == materialId)
                .ToListAsync();
            _context.MaterialCompletions.RemoveRange(completions);
        }
    }
}
