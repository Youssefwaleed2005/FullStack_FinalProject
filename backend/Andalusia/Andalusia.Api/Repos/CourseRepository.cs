using Andalusia.Api.Data;
using Andalusia.Api.DTOs.Requests;
using Andalusia.Api.Enums;
using Andalusia.Api.Models;
using Andalusia.Api.Repos.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace Andalusia.Api.Repos
{
    public class CourseRepository : GenericRepository<Course>, ICourseRepository
    {
        public CourseRepository(AppDbContext context) : base(context) { }

        public async Task<(IEnumerable<Course> Items, int TotalCount)> GetPagedAsync(CourseQueryParameters query)
        {
            //  Start with all courses, including their category and instructor
            IQueryable<Course> courses = _dbSet
                .AsNoTracking()
                .Include(c => c.Category)
                .Include(c => c.Instructor);

            //  Search in title and short description
            if (!string.IsNullOrWhiteSpace(query.Search))
            {
                var search = query.Search.Trim();
                courses = courses.Where(c =>
                    c.Title.Contains(search) ||
                    (c.ShortDescription != null && c.ShortDescription.Contains(search)));
            }

            //  Filters 
            if (query.CategoryId.HasValue)
                courses = courses.Where(c => c.CategoryId == query.CategoryId.Value);

            if (query.Status.HasValue)
                courses = courses.Where(c => c.Status == query.Status.Value);
            else
                courses = courses.Where(c => c.Status != CatalogStatus.Draft); 

            if (query.Type.HasValue)
                courses = courses.Where(c => c.Type == query.Type.Value);

            if (query.IsFeatured.HasValue)
                courses = courses.Where(c => c.IsFeatured == query.IsFeatured.Value);

            if (query.MinPrice.HasValue)
                courses = courses.Where(c => c.Price >= query.MinPrice.Value);

            if (query.MaxPrice.HasValue)
                courses = courses.Where(c => c.Price <= query.MaxPrice.Value);

            var totalCount = await courses.CountAsync();

            courses = query.SortBy?.ToLower() switch
            {
                "title" => query.SortDescending
                    ? courses.OrderByDescending(c => c.Title)
                    : courses.OrderBy(c => c.Title),

                "price" => query.SortDescending
                    ? courses.OrderByDescending(c => c.Price)
                    : courses.OrderBy(c => c.Price),

                "startdate" => query.SortDescending
                    ? courses.OrderByDescending(c => c.StartDate)
                    : courses.OrderBy(c => c.StartDate),

                _ => courses.OrderByDescending(c => c.CreatedAt) 
            };

           
            var items = await courses
                .Skip((query.PageNumber - 1) * query.PageSize)
                .Take(query.PageSize)
                .ToListAsync();

            return (items, totalCount);
        }

        public async Task<Course?> GetByIdWithDetailsAsync(int id)
        {
            return await _dbSet
                .AsNoTracking()
                .Include(c => c.Category)
                .Include(c => c.Instructor)
                .FirstOrDefaultAsync(c => c.Id == id);
        }

        public async Task<bool> HasApplicationsOrProgramsAsync(int courseId)
        {
            var hasApplications = await _context.Applications.AnyAsync(a => a.CourseId == courseId);
            var inPrograms = await _context.ProgramCourses.AnyAsync(pc => pc.CourseId == courseId);

            return hasApplications || inPrograms;
        }

        public async Task<bool> CategoryExistsAsync(int categoryId)
        {
            return await _context.Categories.AnyAsync(c => c.Id == categoryId);
        }

        public async Task<bool> InstructorExistsAsync(int userId)
        {
            return await _context.UserRoles.AnyAsync(ur =>
                ur.UserId == userId && ur.Role.Name == "Instructor");
        }
    }
}