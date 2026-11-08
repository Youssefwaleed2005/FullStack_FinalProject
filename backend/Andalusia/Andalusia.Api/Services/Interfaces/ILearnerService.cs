using Andalusia.Api.DTOs.Requests;
using Andalusia.Api.DTOs.Responses;

namespace Andalusia.Api.Services.Interfaces
{
    public interface ILearnerService
    {
        Task<LearnerDashboardDto> GetDashboardAsync(int userId);
        Task<List<LearnerCourseDto>> GetMyCoursesAsync(int userId);
        Task<List<LearnerNotificationDto>> GetNotificationsAsync(int userId);
        Task<LearnerActivityDto> GetActivityAsync(int userId);

        Task<CourseReviewDto?> GetMyReviewAsync(int userId, int courseId);
        Task<CourseReviewDto> SaveMyReviewAsync(int userId, int courseId, CourseReviewRequestDto dto);
        Task DeleteMyReviewAsync(int userId, int courseId);
        Task<LearnerCourseDetailDto> GetCourseAsync(int userId, int courseId);
        Task<List<LearnerSessionDto>> GetSessionsAsync(int userId, int courseId);
        Task<List<LearnerMaterialDto>> GetMaterialsAsync(int userId, int courseId);
        Task<MaterialCompletionResultDto> SetMaterialCompletionAsync(int userId, int materialId, bool completed);
        Task<List<LearnerAssignmentDto>> GetAssignmentsAsync(int userId, int courseId);
        Task<MySubmissionDto> SubmitAsync(int userId, int assignmentId, SubmitAssignmentRequestDto dto);

        // enrollmentId → live progress % (used by EnrollmentService for "My learning")
        Task<Dictionary<int, int>> GetEnrollmentProgressAsync(int userId);
    }
}