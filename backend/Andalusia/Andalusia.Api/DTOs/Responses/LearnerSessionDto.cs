using Andalusia.Api.Enums;

namespace Andalusia.Api.DTOs.Responses
{
    public class LearnerSessionDto
    {
        public int Id { get; set; }
        public int CourseId { get; set; }
        public string Title { get; set; } = string.Empty;
        public string? Description { get; set; }
        public DateTime StartTime { get; set; }
        public DateTime EndTime { get; set; }
        public string? Location { get; set; }
        public bool IsPast { get; set; }

        // null = not marked yet (or session hasn't happened)
        public AttendanceStatus? MyAttendance { get; set; }
    }
}