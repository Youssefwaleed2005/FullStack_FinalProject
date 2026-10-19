using Andalusia.Api.Enums;

namespace Andalusia.Api.DTOs.Responses
{
    public class MaterialResponseDto
    {
        public int Id { get; set; }
        public int CourseId { get; set; }
        public string Title { get; set; } = string.Empty;
        public string? Description { get; set; }
        public MaterialType Type { get; set; }
        public string Url { get; set; } = string.Empty;
        public DateTime CreatedAt { get; set; }
    }
}