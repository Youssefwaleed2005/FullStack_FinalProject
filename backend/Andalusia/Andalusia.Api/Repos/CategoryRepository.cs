using Andalusia.Api.Data;
using Andalusia.Api.Models;
using Andalusia.Api.Repos.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace Andalusia.Api.Repos
{
    public class CategoryRepository : GenericRepository<Category>, ICategoryRepository
    {
        public CategoryRepository(AppDbContext context) : base(context) { }

        public async Task<bool> NameExistsAsync(string name, int? excludeId = null)
        {
            var normalizedName = name.Trim().ToLower();

            return await _dbSet.AnyAsync(c =>
                c.Name.ToLower() == normalizedName &&
                (excludeId == null || c.Id != excludeId));
        }

        public async Task<bool> HasCoursesOrProgramsAsync(int categoryId)
        {
            var hasCourses = await _context.Courses.AnyAsync(c => c.CategoryId == categoryId);
            var hasPrograms = await _context.Programs.AnyAsync(p => p.CategoryId == categoryId);

            return hasCourses || hasPrograms;
        }
    }
}