using Andalusia.Api.DTOs.Requests;
using Andalusia.Api.DTOs.Responses;
using Andalusia.Api.Enums;
using Andalusia.Api.Models;

namespace Andalusia.Api.Mapping
{
    public static class AssignmentMapping
    {
        // Assignment (with Submissions loaded) → AssignmentResponseDto
        public static AssignmentResponseDto ToResponseDto(this Assignment assignment)
        {
            return new AssignmentResponseDto
            {
                Id = assignment.Id,
                CourseId = assignment.CourseId,
                Title = assignment.Title,
                Description = assignment.Description,
                DueDate = assignment.DueDate,
                MaxScore = assignment.MaxScore,
                CreatedAt = assignment.CreatedAt,
                IsPastDue = assignment.DueDate < DateTime.UtcNow,
                SubmissionCount = assignment.Submissions.Count,
                GradedCount = assignment.Submissions.Count(s => s.Status == SubmissionStatus.Graded)
            };
        }

        public static Assignment ToEntity(this AssignmentRequestDto dto, int courseId)
        {
            return new Assignment
            {
                CourseId = courseId,
                Title = dto.Title.Trim(),
                Description = dto.Description,
                DueDate = dto.DueDate,
                MaxScore = dto.MaxScore
            };
        }

        public static void UpdateEntity(this AssignmentRequestDto dto, Assignment assignment)
        {
            assignment.Title = dto.Title.Trim();
            assignment.Description = dto.Description;
            assignment.DueDate = dto.DueDate;
            assignment.MaxScore = dto.MaxScore;
        }

        // Submission (with User + Assignment loaded) → SubmissionResponseDto
        public static SubmissionResponseDto ToResponseDto(this Submission submission)
        {
            return new SubmissionResponseDto
            {
                Id = submission.Id,
                AssignmentId = submission.AssignmentId,
                UserId = submission.UserId,
                StudentName = $"{submission.User.FirstName} {submission.User.LastName}",
                StudentEmail = submission.User.Email,
                Content = submission.Content,
                FileUrl = submission.FileUrl,
                SubmittedAt = submission.SubmittedAt,
                IsLate = submission.SubmittedAt > submission.Assignment.DueDate,
                Status = submission.Status,
                Score = submission.Score,
                MaxScore = submission.Assignment.MaxScore,
                Feedback = submission.Feedback,
                GradedAt = submission.GradedAt
            };
        }
    }
}