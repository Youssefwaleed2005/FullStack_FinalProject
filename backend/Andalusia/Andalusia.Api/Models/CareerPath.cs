using System.ComponentModel.DataAnnotations;

namespace Andalusia.Api.Models
{
    public class CareerPath
    {
        public int Id { get; set; }

        [Required]
        [MaxLength(200)]
        public string Title { get; set; } = string.Empty;

        [MaxLength(500)]
        public string? ShortDescription { get; set; }

        public string? Overview { get; set; }

        [MaxLength(500)]
        public string? RecommendedSkills { get; set; }

        [MaxLength(300)]
        public string? ImageUrl { get; set; }

        public bool IsFeatured { get; set; }

        public bool IsPublished { get; set; }

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public ICollection<CareerPathProgram> CareerPathPrograms { get; set; } = new List<CareerPathProgram>();
    }
}