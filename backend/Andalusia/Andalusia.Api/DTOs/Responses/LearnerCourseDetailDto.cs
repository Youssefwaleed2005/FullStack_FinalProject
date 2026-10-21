using Andalusia.Api.Enums;

namespace Andalusia.Api.DTOs.Responses
{
    public class LearnerCourseDetailDto
    {
        public int Id { get; set; }
        public string Title { get; set; } = string.Empty;
        public string? ShortDescription { get; set; }
        public string? FullDescription { get; set; }
        public string? Objectives { get; set; }
        public string? ImageUrl { get; set; }
        public string CategoryName { get; set; } = string.Empty;
        public CatalogStatus Status { get; set; }
        public int DurationHours { get; set; }

        // Schedule + location (offline courses)
        public DateOnly? StartDate { get; set; }
        public DateOnly? EndDate { get; set; }
        public string? Schedule { get; set; }
        public string? Location { get; set; }

        public LearnerInstructorDto? Instructor { get; set; }

        public string? ProgramTitle { get; set; }
        public EnrollmentStatus EnrollmentStatus { get; set; }
        public bool CanSubmit { get; set; }            // false when enrollment isn't Active

        public LearnerProgressDto Progress { get; set; } = new();
    }

    public class LearnerInstructorDto
    {
        public int Id { get; set; }
        public string FullName { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public string? Specialization { get; set; }
        public string? Bio { get; set; }
        public string? PhotoUrl { get; set; }
    }

    // Same numbers the instructor sees in StudentsTab
    public class LearnerProgressDto
    {
        public int AttendedSessions { get; set; }
        public int PastSessions { get; set; }
        public int SubmittedAssignments { get; set; }
        public int TotalAssignments { get; set; }
        public int CompletedMaterials { get; set; }
        public int TotalMaterials { get; set; }
        public double? AverageScore { get; set; }      // % across graded work
        public int ProgressPercent { get; set; }
    }
}