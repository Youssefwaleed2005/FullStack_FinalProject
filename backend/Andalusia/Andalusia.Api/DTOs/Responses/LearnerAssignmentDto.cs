using Andalusia.Api.Enums;

namespace Andalusia.Api.DTOs.Responses
{
    public class LearnerAssignmentDto
    {
        public int Id { get; set; }
        public int CourseId { get; set; }
        public string Title { get; set; } = string.Empty;
        public string? Description { get; set; }
        public DateTime DueDate { get; set; }
        public int MaxScore { get; set; }
        public bool IsPastDue { get; set; }

        // null = I haven't submitted
        public MySubmissionDto? MySubmission { get; set; }
    }

    public class MySubmissionDto
    {
        public int Id { get; set; }
        public string? Content { get; set; }
        public string? FileUrl { get; set; }
        public DateTime SubmittedAt { get; set; }
        public bool IsLate { get; set; }
        public SubmissionStatus Status { get; set; }
        public int? Score { get; set; }
        public string? Feedback { get; set; }
        public DateTime? GradedAt { get; set; }
    }
}