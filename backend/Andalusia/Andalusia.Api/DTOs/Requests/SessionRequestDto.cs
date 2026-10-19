using System.ComponentModel.DataAnnotations;

namespace Andalusia.Api.DTOs.Requests
{
   
    public class SessionRequestDto
    {
        [Required]
        [MaxLength(200)]
        public string Title { get; set; } = string.Empty;

        [MaxLength(1000)]
        public string? Description { get; set; }

        [Required]
        public DateTime StartTime { get; set; }

        [Required]
        public DateTime EndTime { get; set; }

        [MaxLength(200)]
        public string? Location { get; set; }
    }
}