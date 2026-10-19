namespace Andalusia.Api.DTOs.Responses
{
    // One learner in "My students" for a course
    public class CourseStudentDto
    {
        public int UserId { get; set; }
        public string FullName { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public DateTime EnrolledAt { get; set; }

        public int AttendedSessions { get; set; }
        public int PastSessions { get; set; }

        public int SubmittedAssignments { get; set; }
        public int TotalAssignments { get; set; }
        public double? AverageScore { get; set; }    

        public int ProgressPercent { get; set; }
    }
}
