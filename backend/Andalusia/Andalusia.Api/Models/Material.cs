using System.ComponentModel.DataAnnotations;
using Andalusia.Api.Enums;

namespace Andalusia.Api.Models
{
   
    public class Material
    {
        public int Id { get; set; }

        [Required]
        [MaxLength(200)]
        public string Title { get; set; } = string.Empty;

        [MaxLength(1000)]
        public string? Description { get; set; }

        public MaterialType Type { get; set; } = MaterialType.Link;

        [Required]
        [MaxLength(500)]
        public string Url { get; set; } = string.Empty;

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        public int CourseId { get; set; }
        public Course Course { get; set; } = null!;
    }
}