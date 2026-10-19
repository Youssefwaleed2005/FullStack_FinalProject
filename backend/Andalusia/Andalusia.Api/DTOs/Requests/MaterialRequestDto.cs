using System.ComponentModel.DataAnnotations;
using Andalusia.Api.Enums;

namespace Andalusia.Api.DTOs.Requests
{
    
    public class MaterialRequestDto
    {
        [Required]
        [MaxLength(200)]
        public string Title { get; set; } = string.Empty;

        [MaxLength(1000)]
        public string? Description { get; set; }

        public MaterialType Type { get; set; } = MaterialType.Link;

        [Required]
        [Url]
        [MaxLength(500)]
        public string Url { get; set; } = string.Empty;
    }
}