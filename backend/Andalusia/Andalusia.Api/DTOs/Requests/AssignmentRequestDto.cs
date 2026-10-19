using System.ComponentModel.DataAnnotations;

namespace Andalusia.Api.DTOs.Requests
{
    
    public class AssignmentRequestDto
    {
        [Required]
        [MaxLength(200)]
        public string Title { get; set; } = string.Empty;

        public string? Description { get; set; }

        [Required]
        public DateTime DueDate { get; set; }

        [Range(1, 1000)]
        public int MaxScore { get; set; } = 100;
    }
}