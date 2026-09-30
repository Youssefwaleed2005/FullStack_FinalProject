using System.ComponentModel.DataAnnotations;

namespace Andalusia.Api.DTOs.Requests
{
    public class CareerPathRequestDto
    {
        [Required, MaxLength(200)]
        public string Title { get; set; } = string.Empty;

        [MaxLength(500)]
        public string? ShortDescription { get; set; }

        public string? Overview { get; set; }

        [MaxLength(500)]
        public string? RecommendedSkills { get; set; }

        [MaxLength(300), Url]
        public string? ImageUrl { get; set; }

        public bool IsFeatured { get; set; }
        public bool IsPublished { get; set; }

        public List<int> ProgramIds { get; set; } = new();
    }
}