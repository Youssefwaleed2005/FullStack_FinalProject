using System.ComponentModel.DataAnnotations;

namespace Andalusia.Api.Models
{
    public class Testimonial
    {
        public int Id { get; set; }

        [Required]
        [MaxLength(100)]
        public string AuthorName { get; set; } = string.Empty;

        [MaxLength(150)]
        public string? AuthorTitle { get; set; }

        [MaxLength(300)]
        public string? PhotoUrl { get; set; }

        [Required]
        [MaxLength(1000)]
        public string Content { get; set; } = string.Empty;

        [Range(1, 5)]
        public int? Rating { get; set; }

        public bool IsPublished { get; set; }

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    }
}