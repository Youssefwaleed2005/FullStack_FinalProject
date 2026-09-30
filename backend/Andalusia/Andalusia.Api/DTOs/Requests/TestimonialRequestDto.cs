using System.ComponentModel.DataAnnotations;

namespace Andalusia.Api.DTOs.Requests
{
    public class TestimonialRequestDto
    {
        [Required, MaxLength(100)]
        public string AuthorName { get; set; } = string.Empty;

        [MaxLength(150)]
        public string? AuthorTitle { get; set; }

        [MaxLength(300), Url]
        public string? PhotoUrl { get; set; }

        [Required, MaxLength(1000)]
        public string Content { get; set; } = string.Empty;

        [Range(1, 5)]
        public int? Rating { get; set; }

        public bool IsPublished { get; set; }
    }
}