using System.ComponentModel.DataAnnotations;

namespace Andalusia.Api.DTOs.Requests
{
    public class CreateApplicationRequestDto
    {
        
        public int? CourseId { get; set; }
        public int? ProgramId { get; set; }

        [MaxLength(1000, ErrorMessage = "Notes cannot exceed 1000 characters.")]
        public string? Notes { get; set; }
    }
}