using Andalusia.Api.Data;
using Andalusia.Api.Models;
using Andalusia.Api.Repos.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace Andalusia.Api.Repos
{
    public class CareerPathRepository : GenericRepository<CareerPath>, ICareerPathRepository
    {
        public CareerPathRepository(AppDbContext context) : base(context) { }

        // Public list (cards): only needs the links to count programs
        public async Task<IEnumerable<CareerPath>> GetPublishedAsync(bool? isFeatured, int? take)
        {
            IQueryable<CareerPath> paths = _dbSet
                .AsNoTracking()
                .Include(cp => cp.CareerPathPrograms)
                .Where(cp => cp.IsPublished);

            if (isFeatured.HasValue)
                paths = paths.Where(cp => cp.IsFeatured == isFeatured.Value);

            paths = paths.OrderByDescending(cp => cp.CreatedAt);

            if (take.HasValue && take.Value > 0)
                paths = paths.Take(take.Value);

            return await paths.ToListAsync();
        }

        // Details page: links + the programs themselves
        public async Task<CareerPath?> GetByIdWithDetailsAsync(int id)
        {
            return await _dbSet
                .AsNoTracking()
                .AsSplitQuery()
                // each program's category
                .Include(cp => cp.CareerPathPrograms)
                    .ThenInclude(cpp => cpp.Program)
                        .ThenInclude(p => p.Category)
                // each program's courses, with their category
                .Include(cp => cp.CareerPathPrograms)
                    .ThenInclude(cpp => cpp.Program)
                        .ThenInclude(p => p.ProgramCourses)
                            .ThenInclude(pc => pc.Course)
                                .ThenInclude(c => c.Category)
                // each course's instructor
                .Include(cp => cp.CareerPathPrograms)
                    .ThenInclude(cpp => cpp.Program)
                        .ThenInclude(p => p.ProgramCourses)
                            .ThenInclude(pc => pc.Course)
                                .ThenInclude(c => c.Instructor)
                .FirstOrDefaultAsync(cp => cp.Id == id);
        }

        // Tracked, with links, for update/delete
        public async Task<CareerPath?> GetByIdWithLinksAsync(int id)
        {
            return await _dbSet
                .Include(cp => cp.CareerPathPrograms)
                .FirstOrDefaultAsync(cp => cp.Id == id);
        }

        public async Task<bool> AllProgramsExistAsync(IEnumerable<int> programIds)
        {
            var ids = programIds.Distinct().ToList();
            if (ids.Count == 0) return true;

            var found = await _context.Programs.CountAsync(p => ids.Contains(p.Id));
            return found == ids.Count;
        }

        public void RemoveLinks(IEnumerable<CareerPathProgram> links)
        {
            _context.CareerPathPrograms.RemoveRange(links);
        }
    }
}