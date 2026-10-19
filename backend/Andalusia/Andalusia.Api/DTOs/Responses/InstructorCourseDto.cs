using Andalusia.Api.Enums;

namespace Andalusia.Api.DTOs.Responses
{
    // One course in the instructor's "My courses" list
    public class InstructorCourseDto
    {
        public int Id { get; set; }
        public string Title { get; set; } = string.Empty;
        public string? ImageUrl { get; set; }
        public CatalogStatus Status { get; set; }
        public DateOnly? StartDate { get; set; }
        public DateOnly? EndDate { get; set; }
        public string? Location { get; set; }
        public string? Schedule { get; set; }

        public int Capacity { get; set; }
        public int StudentCount { get; set; }

        public int SessionCount { get; set; }
        public int UpcomingSessionCount { get; set; }
        public DateTime? NextSessionAt { get; set; }

        public int AssignmentCount { get; set; }
        public int PendingSubmissions { get; set; }   // submitted but not graded yet
    }
}