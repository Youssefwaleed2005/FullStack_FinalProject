using Andalusia.Api.Models;

namespace Andalusia.Api.Repos.Interfaces
{
    public interface ILearnerRepository
    {
        Task<List<Enrollment>> GetMyEnrollmentsAsync(int userId);
        Task<List<Course>> GetCoursesWithMyActivityAsync(List<int> courseIds, int userId);
        Task<Course?> GetCourseWithMyActivityAsync(int courseId, int userId);

        Task<Assignment?> GetAssignmentAsync(int assignmentId);
        Task<Submission?> GetMySubmissionAsync(int assignmentId, int userId);
        Task AddSubmissionAsync(Submission submission);
        Task SaveChangesAsync();

        Task<bool> CourseExistsAsync(int courseId);
    }
}