using Andalusia.Api.Enums;

namespace Andalusia.Api.DTOs.Responses
{
    public class SubmissionResponseDto
    {
        public int Id { get; set; }
        public int AssignmentId { get; set; }

        public int UserId { get; set; }
        public string StudentName { get; set; } = string.Empty;
        public string StudentEmail { get; set; } = string.Empty;

        public string? Content { get; set; }
        public string? FileUrl { get; set; }
        public DateTime SubmittedAt { get; set; }
        public bool IsLate { get; set; }

        public SubmissionStatus Status { get; set; }
        public int? Score { get; set; }
        public int MaxScore { get; set; }
        public string? Feedback { get; set; }
        public DateTime? GradedAt { get; set; }
    }
}
