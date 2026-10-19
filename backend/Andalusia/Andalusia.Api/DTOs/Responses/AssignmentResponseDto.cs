namespace Andalusia.Api.DTOs.Responses
{
    public class AssignmentResponseDto
    {
        public int Id { get; set; }
        public int CourseId { get; set; }
        public string Title { get; set; } = string.Empty;
        public string? Description { get; set; }
        public DateTime DueDate { get; set; }
        public int MaxScore { get; set; }
        public DateTime CreatedAt { get; set; }

        public bool IsPastDue { get; set; }
        public int SubmissionCount { get; set; }
        public int GradedCount { get; set; }
    }
}