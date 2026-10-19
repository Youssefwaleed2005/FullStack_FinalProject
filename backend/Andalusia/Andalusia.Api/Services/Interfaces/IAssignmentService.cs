using Andalusia.Api.DTOs.Requests;
using Andalusia.Api.DTOs.Responses;

namespace Andalusia.Api.Services.Interfaces
{
    public interface IAssignmentService
    {
        Task<List<AssignmentResponseDto>> GetByCourseAsync(int instructorId, int courseId);
        Task<AssignmentResponseDto> CreateAsync(int instructorId, int courseId, AssignmentRequestDto dto);
        Task<AssignmentResponseDto> UpdateAsync(int instructorId, int assignmentId, AssignmentRequestDto dto);
        Task DeleteAsync(int instructorId, int assignmentId);

        Task<List<SubmissionResponseDto>> GetSubmissionsAsync(int instructorId, int assignmentId);
        Task<SubmissionResponseDto> GradeAsync(int instructorId, int submissionId, GradeSubmissionRequestDto dto);
    }
}