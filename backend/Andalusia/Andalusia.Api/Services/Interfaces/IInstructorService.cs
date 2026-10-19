using Andalusia.Api.DTOs.Responses;
using Andalusia.Api.Models;

namespace Andalusia.Api.Services.Interfaces
{
    public interface IInstructorService
    {
        Task<InstructorDashboardDto> GetDashboardAsync(int instructorId);
        Task<List<InstructorCourseDto>> GetMyCoursesAsync(int instructorId);
        Task<List<CourseStudentDto>> GetCourseStudentsAsync(int instructorId, int courseId);

        // 404 if the course doesn't exist, 403 if it isn't mine
        Task<Course> EnsureOwnsCourseAsync(int instructorId, int courseId);
    }
}