using System.ComponentModel.DataAnnotations;

namespace Andalusia.Api.DTOs.Requests
{
    // Learner submits (or updates) their answer: text, a link, or both
    public class SubmitAssignmentRequestDto
    {
        [MaxLength(5000)]
        public string? Content { get; set; }

        [MaxLength(500)]
        [Url]
        public string? FileUrl { get; set; }
    }
}