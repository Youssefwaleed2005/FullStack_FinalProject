using Andalusia.Api.Enums;

namespace Andalusia.Api.DTOs.Responses
{
    public class LearnerCourseDto
    {
        public int Id { get; set; }
        public string Title { get; set; } = string.Empty;
        public string? ImageUrl { get; set; }
        public CatalogStatus Status { get; set; }
        public DateOnly? StartDate { get; set; }
        public DateOnly? EndDate { get; set; }
        public string? Schedule { get; set; }
        public string? Location { get; set; }
        public string? InstructorName { get; set; }

        // How I got access: directly, or through a program
        public string? ProgramTitle { get; set; }
        public EnrollmentStatus EnrollmentStatus { get; set; }

        public int ProgressPercent { get; set; }
        public DateTime? NextSessionAt { get; set; }
        public int PendingAssignments { get; set; }    // not submitted yet
    }
}