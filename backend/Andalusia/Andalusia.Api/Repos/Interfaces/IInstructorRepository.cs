using Andalusia.Api.Models;

namespace Andalusia.Api.Repos.Interfaces
{
    public interface IInstructorRepository
    {
        Task<Course?> GetCourseAsync(int courseId);
        Task<List<Course>> GetCoursesWithActivityAsync(int instructorId);
        Task<List<int>> GetActiveStudentIdsAsync(int courseId);
        Task<List<Enrollment>> GetActiveEnrollmentsAsync(int courseId);
        Task<Course?> GetCourseWithActivityAsync(int courseId);
    }
}