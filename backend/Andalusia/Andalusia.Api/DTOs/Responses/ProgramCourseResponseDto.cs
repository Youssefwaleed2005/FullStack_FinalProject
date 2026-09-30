namespace Andalusia.Api.DTOs.Responses
{
    public class ProgramCourseResponseDto
    {
        public int CourseId { get; set; }
        public string Title { get; set; } = string.Empty;
        public string? ImageUrl { get; set; }
        public int DurationHours { get; set; }
        public int SortOrder { get; set; }
    }
}