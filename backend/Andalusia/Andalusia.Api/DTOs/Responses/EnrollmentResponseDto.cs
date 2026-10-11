using Andalusia.Api.Enums;

namespace Andalusia.Api.DTOs.Responses
{
    public class EnrollmentResponseDto
    {
        public int Id { get; set; }
        public EnrollmentStatus Status { get; set; }
        public DateTime EnrolledAt { get; set; }
        public int ProgressPercent { get; set; }
        public int ApplicationId { get; set; }

        // What the learner is enrolled in
        public string TargetType { get; set; } = string.Empty;   // "Course" or "Program"
        public int? CourseId { get; set; }
        public int? ProgramId { get; set; }
        public string TargetTitle { get; set; } = string.Empty;
        public string? ImageUrl { get; set; }
    }
}