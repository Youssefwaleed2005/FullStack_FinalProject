using Andalusia.Api.DTOs.Requests;
using Andalusia.Api.DTOs.Responses;
using Andalusia.Api.Enums;
using Andalusia.Api.Exceptions;
using Andalusia.Api.Mapping;
using Andalusia.Api.Models;
using Andalusia.Api.Repos.Interfaces;
using Andalusia.Api.Services.Interfaces;

namespace Andalusia.Api.Services
{
    public class AssignmentService : IAssignmentService
    {
        private readonly IAssignmentRepository _assignmentRepository;
        private readonly IInstructorService _instructorService;

        public AssignmentService(IAssignmentRepository assignmentRepository, IInstructorService instructorService)
        {
            _assignmentRepository = assignmentRepository;
            _instructorService = instructorService;
        }

        public async Task<List<AssignmentResponseDto>> GetByCourseAsync(int instructorId, int courseId)
        {
            await _instructorService.EnsureOwnsCourseAsync(instructorId, courseId);

            var assignments = await _assignmentRepository.GetByCourseAsync(courseId);
            return assignments.Select(a => a.ToResponseDto()).ToList();
        }

        public async Task<AssignmentResponseDto> CreateAsync(int instructorId, int courseId, AssignmentRequestDto dto)
        {
            await _instructorService.EnsureOwnsCourseAsync(instructorId, courseId);

            var assignment = dto.ToEntity(courseId);
            await _assignmentRepository.AddAsync(assignment);
            await _assignmentRepository.SaveChangesAsync();

            return assignment.ToResponseDto();
        }

        public async Task<AssignmentResponseDto> UpdateAsync(int instructorId, int assignmentId, AssignmentRequestDto dto)
        {
            var assignment = await GetOwnedAssignmentAsync(instructorId, assignmentId);

            // Guard: don't lower the max score below a grade already given
            var highestScore = assignment.Submissions.Max(s => s.Score) ?? 0;
            if (dto.MaxScore < highestScore)
                throw new BadRequestException($"Max score cannot be lower than an existing grade ({highestScore}).");

            dto.UpdateEntity(assignment);
            await _assignmentRepository.SaveChangesAsync();

            return assignment.ToResponseDto();
        }

        public async Task DeleteAsync(int instructorId, int assignmentId)
        {
            var assignment = await GetOwnedAssignmentAsync(instructorId, assignmentId);

            if (assignment.Submissions.Any())
                throw new ConflictException("Students already submitted this assignment, so it cannot be deleted.");

            _assignmentRepository.Delete(assignment);
            await _assignmentRepository.SaveChangesAsync();
        }

        public async Task<List<SubmissionResponseDto>> GetSubmissionsAsync(int instructorId, int assignmentId)
        {
            await GetOwnedAssignmentAsync(instructorId, assignmentId);

            var submissions = await _assignmentRepository.GetSubmissionsAsync(assignmentId);
            return submissions.Select(s => s.ToResponseDto()).ToList();
        }

        public async Task<SubmissionResponseDto> GradeAsync(int instructorId, int submissionId, GradeSubmissionRequestDto dto)
        {
            var submission = await _assignmentRepository.GetSubmissionForGradingAsync(submissionId)
                ?? throw new NotFoundException($"Submission with id {submissionId} was not found.");

            await _instructorService.EnsureOwnsCourseAsync(instructorId, submission.Assignment.CourseId);

            if (dto.Score > submission.Assignment.MaxScore)
                throw new BadRequestException($"Score cannot be more than {submission.Assignment.MaxScore}.");

            submission.Score = dto.Score;
            submission.Feedback = dto.Feedback;
            submission.Status = SubmissionStatus.Graded;
            submission.GradedAt = DateTime.UtcNow;

            await _assignmentRepository.SaveChangesAsync();
            return submission.ToResponseDto();
        }

        // The assignment exists (404) and belongs to one of my courses (403)
        private async Task<Assignment> GetOwnedAssignmentAsync(int instructorId, int assignmentId)
        {
            var assignment = await _assignmentRepository.GetByIdWithSubmissionsAsync(assignmentId)
                ?? throw new NotFoundException($"Assignment with id {assignmentId} was not found.");

            await _instructorService.EnsureOwnsCourseAsync(instructorId, assignment.CourseId);
            return assignment;
        }
    }
}