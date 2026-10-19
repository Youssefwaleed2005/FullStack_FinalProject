using Andalusia.Api.Enums;

namespace Andalusia.Api.DTOs.Responses
{
    // The class list for one session
    public class SessionAttendanceDto
    {
        public int SessionId { get; set; }
        public int CourseId { get; set; }
        public string SessionTitle { get; set; } = string.Empty;
        public DateTime StartTime { get; set; }

        public List<StudentAttendanceDto> Students { get; set; } = new();
    }

    public class StudentAttendanceDto
    {
        public int UserId { get; set; }
        public string FullName { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public AttendanceStatus? Status { get; set; }   // null = not marked yet
        public DateTime? MarkedAt { get; set; }
    }
}