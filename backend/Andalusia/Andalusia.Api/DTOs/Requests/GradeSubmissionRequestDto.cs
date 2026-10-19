using System.ComponentModel.DataAnnotations;

namespace Andalusia.Api.DTOs.Requests
{
   
    public class GradeSubmissionRequestDto
    {
        [Range(0, 1000)]
        public int Score { get; set; }

        [MaxLength(1000)]
        public string? Feedback { get; set; }
    }
}