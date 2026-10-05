using Andalusia.Api.Data;
using Andalusia.Api.DTOs.Requests;
using Andalusia.Api.Enums;
using Andalusia.Api.Models;
using Andalusia.Api.Repos.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace Andalusia.Api.Repos
{
    public class ProgramRepository : GenericRepository<AcademyProgram>, IProgramRepository
    {
        public ProgramRepository(AppDbContext context) : base(context) { }

        public async Task<(IEnumerable<AcademyProgram> Items, int TotalCount)> GetPagedAsync(ProgramQueryParameters query)
        {
           
            IQueryable<AcademyProgram> programs = _dbSet
                .AsNoTracking()
                .Include(p => p.Category)
                .Include(p => p.ProgramCourses);

            if (!string.IsNullOrWhiteSpace(query.Search))
            {
                var search = query.Search.Trim();
                programs = programs.Where(p =>
                    p.Title.Contains(search) ||
                    (p.ShortDescription != null && p.ShortDescription.Contains(search)));
            }

           
            if (query.CategoryId.HasValue)
                programs = programs.Where(p => p.CategoryId == query.CategoryId.Value);

            if (query.Status.HasValue)
                programs = programs.Where(p => p.Status == query.Status.Value);
            else
                programs = programs.Where(p => p.Status != CatalogStatus.Draft); 

            if (query.IsFeatured.HasValue)
                programs = programs.Where(p => p.IsFeatured == query.IsFeatured.Value);

            if (query.MinPrice.HasValue)
                programs = programs.Where(p => p.Price >= query.MinPrice.Value);

            if (query.MaxPrice.HasValue)
                programs = programs.Where(p => p.Price <= query.MaxPrice.Value);

          
            var totalCount = await programs.CountAsync();

          
            programs = query.SortBy?.ToLower() switch
            {
                "title" => query.SortDescending
                    ? programs.OrderByDescending(p => p.Title)
                    : programs.OrderBy(p => p.Title),

                "price" => query.SortDescending
                    ? programs.OrderByDescending(p => p.Price)
                    : programs.OrderBy(p => p.Price),

                "startdate" => query.SortDescending
                    ? programs.OrderByDescending(p => p.StartDate)
                    : programs.OrderBy(p => p.StartDate),

                _ => programs.OrderByDescending(p => p.CreatedAt) 
            };

            var items = await programs
                .Skip((query.PageNumber - 1) * query.PageSize)
                .Take(query.PageSize)
                .ToListAsync();

            return (items, totalCount);
        }

        public async Task<AcademyProgram?> GetByIdWithDetailsAsync(int id)
        {
            return await _dbSet
                .AsNoTracking()
                .Include(p => p.Category)
                .Include(p => p.ProgramCourses)
                    .ThenInclude(pc => pc.Course)
                .FirstOrDefaultAsync(p => p.Id == id);
        }

        public async Task<bool> HasApplicationsOrCareerPathsAsync(int programId)
        {
            var hasApplications = await _context.Applications.AnyAsync(a => a.ProgramId == programId);
            var inCareerPaths = await _context.CareerPathPrograms.AnyAsync(cp => cp.ProgramId == programId);

            return hasApplications || inCareerPaths;
        }

        public async Task<bool> CategoryExistsAsync(int categoryId)
        {
            return await _context.Categories.AnyAsync(c => c.Id == categoryId);
        }

        public async Task<List<int>> GetExistingCourseIdsAsync(List<int> courseIds)
        {
            return await _context.Courses
                .Where(c => courseIds.Contains(c.Id))
                .Select(c => c.Id)
                .ToListAsync();
        }

        public async Task ReplaceProgramCoursesAsync(int programId, List<int> courseIds)
        {
            var existingLinks = await _context.ProgramCourses
                .Where(pc => pc.ProgramId == programId)
                .ToListAsync();

            
            var linksToRemove = existingLinks.Where(pc => !courseIds.Contains(pc.CourseId));
            _context.ProgramCourses.RemoveRange(linksToRemove);

           
            for (int i = 0; i < courseIds.Count; i++)
            {
                var existing = existingLinks.FirstOrDefault(pc => pc.CourseId == courseIds[i]);

                if (existing != null)
                {
                    existing.SortOrder = i + 1;
                }
                else
                {
                    _context.ProgramCourses.Add(new ProgramCourse
                    {
                        ProgramId = programId,
                        CourseId = courseIds[i],
                        SortOrder = i + 1
                    });
                }
            }
        }
        public async Task<IEnumerable<AcademyProgram>> GetRelatedAsync(int programId, int categoryId, int take)
        {
            return await _dbSet
                .AsNoTracking()
                .Include(p => p.Category)
                .Include(p => p.ProgramCourses)
                .Where(p => p.CategoryId == categoryId
                         && p.Id != programId
                         && p.Status != CatalogStatus.Draft)
                .OrderByDescending(p => p.IsFeatured)
                .ThenByDescending(p => p.CreatedAt)
                .Take(take)
                .ToListAsync();
        }
    }
}