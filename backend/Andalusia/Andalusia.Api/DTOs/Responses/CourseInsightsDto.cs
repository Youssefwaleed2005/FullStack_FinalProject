namespace Andalusia.Api.DTOs.Responses
{
    // Charts for the instructor's course page
    public class CourseInsightsDto
    {
        public int StudentCount { get; set; }
        public int AverageProgress { get; set; }
        public int? AverageScore { get; set; }

        // How many students are at 0-24%, 25-49%, 50-74%, 75-100%
        public List<LabelCountDto> ProgressBuckets { get; set; } = new();

        // Submissions per week, last 8 weeks (oldest first)
        public List<LabelCountDto> SubmissionsByWeek { get; set; } = new();

        // Present/late per past session (last 8)
        public List<SessionAttendanceRateDto> AttendanceBySession { get; set; } = new();

        // Students under 40% progress, lowest first
        public List<AtRiskStudentDto> AtRisk { get; set; } = new();
    }

    public class LabelCountDto
    {
        public string Label { get; set; } = string.Empty;
        public int Count { get; set; }
    }

    public class SessionAttendanceRateDto
    {
        public string Title { get; set; } = string.Empty;
        public DateTime StartTime { get; set; }
        public int Attended { get; set; }
        public int Total { get; set; }
    }

    public class AtRiskStudentDto
    {
        public int UserId { get; set; }
        public string FullName { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public int ProgressPercent { get; set; }
        public int MissedSessions { get; set; }
        public int MissingAssignments { get; set; }
    }
}
