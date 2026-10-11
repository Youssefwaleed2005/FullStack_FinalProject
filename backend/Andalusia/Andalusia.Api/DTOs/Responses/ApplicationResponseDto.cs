using Andalusia.Api.Enums;

namespace Andalusia.Api.DTOs.Responses
{
    public class ApplicationResponseDto
    {
        public int Id { get; set; }
        public ApplicationStatus Status { get; set; }
        public string? Notes { get; set; }
        public DateTime CreatedAt { get; set; }
        public DateTime? ReviewedAt { get; set; }

        // What was applied to
        public string TargetType { get; set; } = string.Empty;   // "Course" or "Program"
        public int? CourseId { get; set; }
        public int? ProgramId { get; set; }
        public string TargetTitle { get; set; } = string.Empty;
        public decimal Price { get; set; }
    }
}