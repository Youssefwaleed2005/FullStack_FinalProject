using Andalusia.Api.DTOs.Requests;
using Andalusia.Api.DTOs.Responses;

namespace Andalusia.Api.Services.Interfaces
{
    public interface ILearnerService
    {
        Task<LearnerDashboardDto> GetDashboardAsync(int userId);
        Task<List<LearnerCourseDto>> GetMyCoursesAsync(int userId);
        Task<LearnerCourseDetailDto> GetCourseAsync(int userId, int courseId);
        Task<List<LearnerSessionDto>> GetSessionsAsync(int userId, int courseId);
        Task<List<MaterialResponseDto>> GetMaterialsAsync(int userId, int courseId);
        Task<List<LearnerAssignmentDto>> GetAssignmentsAsync(int userId, int courseId);
        Task<MySubmissionDto> SubmitAsync(int userId, int assignmentId, SubmitAssignmentRequestDto dto);

        // enrollmentId → live progress % (used by EnrollmentService for "My learning")
        Task<Dictionary<int, int>> GetEnrollmentProgressAsync(int userId);
    }
}