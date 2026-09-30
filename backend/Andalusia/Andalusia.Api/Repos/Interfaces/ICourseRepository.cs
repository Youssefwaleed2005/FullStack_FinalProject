using Andalusia.Api.DTOs.Requests;
using Andalusia.Api.Models;

namespace Andalusia.Api.Repos.Interfaces
{
    public interface ICourseRepository : IGenericRepository<Course>
    {
        Task<(IEnumerable<Course> Items, int TotalCount)> GetPagedAsync(CourseQueryParameters query);
        Task<Course?> GetByIdWithDetailsAsync(int id);
        Task<bool> HasApplicationsOrProgramsAsync(int courseId);
        Task<bool> CategoryExistsAsync(int categoryId);
        Task<bool> InstructorExistsAsync(int userId);
    }
}