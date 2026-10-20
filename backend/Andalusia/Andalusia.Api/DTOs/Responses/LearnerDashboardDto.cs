namespace Andalusia.Api.DTOs.Responses
{
    // Numbers + what's next for the learner home page
    public class LearnerDashboardDto
    {
        public int ActiveCourseCount { get; set; }
        public int UpcomingSessionCount { get; set; }
        public int PendingAssignmentCount { get; set; }
        public int AverageProgress { get; set; }

        public List<UpcomingSessionDto> UpcomingSessions { get; set; } = new();
        public List<LearnerCourseDto> Courses { get; set; } = new();
    }
}