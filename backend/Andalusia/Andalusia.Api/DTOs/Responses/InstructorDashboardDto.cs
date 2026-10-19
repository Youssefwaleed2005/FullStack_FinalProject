namespace Andalusia.Api.DTOs.Responses
{
    // Numbers + upcoming sessions for the instructor home page
    public class InstructorDashboardDto
    {
        public int CourseCount { get; set; }
        public int StudentCount { get; set; }          // distinct learners across my courses
        public int UpcomingSessionCount { get; set; }
        public int PendingSubmissions { get; set; }

        public List<UpcomingSessionDto> UpcomingSessions { get; set; } = new();
    }

    public class UpcomingSessionDto
    {
        public int Id { get; set; }
        public int CourseId { get; set; }
        public string CourseTitle { get; set; } = string.Empty;
        public string Title { get; set; } = string.Empty;
        public DateTime StartTime { get; set; }
        public DateTime EndTime { get; set; }
        public string? Location { get; set; }
    }
}