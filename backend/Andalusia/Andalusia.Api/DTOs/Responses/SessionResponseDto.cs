namespace Andalusia.Api.DTOs.Responses
{
    public class SessionResponseDto
    {
        public int Id { get; set; }
        public int CourseId { get; set; }
        public string Title { get; set; } = string.Empty;
        public string? Description { get; set; }
        public DateTime StartTime { get; set; }
        public DateTime EndTime { get; set; }
        public string? Location { get; set; }

        public bool IsPast { get; set; }
        public int AttendanceMarked { get; set; }   // how many attendance rows exist
    }
}