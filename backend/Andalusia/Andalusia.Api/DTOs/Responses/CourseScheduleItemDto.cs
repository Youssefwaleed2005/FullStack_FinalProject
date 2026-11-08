namespace Andalusia.Api.DTOs.Responses
{
    // One planned session, shown publicly on the course page as the course outline
    public class CourseScheduleItemDto
    {
        public int Id { get; set; }
        public string Title { get; set; } = string.Empty;
        public string? Description { get; set; }
        public DateTime StartTime { get; set; }
        public DateTime EndTime { get; set; }
    }
}
