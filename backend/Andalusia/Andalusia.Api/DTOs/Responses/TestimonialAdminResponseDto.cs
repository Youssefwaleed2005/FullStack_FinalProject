namespace Andalusia.Api.DTOs.Responses
{
    public class TestimonialAdminResponseDto
    {
        public int Id { get; set; }
        public string AuthorName { get; set; } = string.Empty;
        public string? AuthorTitle { get; set; }
        public string? PhotoUrl { get; set; }
        public string Content { get; set; } = string.Empty;
        public int? Rating { get; set; }
        public bool IsPublished { get; set; }
        public DateTime CreatedAt { get; set; }
    }
}