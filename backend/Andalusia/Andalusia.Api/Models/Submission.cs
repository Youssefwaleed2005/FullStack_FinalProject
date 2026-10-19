using System.ComponentModel.DataAnnotations;
using Andalusia.Api.Enums;

namespace Andalusia.Api.Models
{
   
    public class Submission
    {
        public int Id { get; set; }

        public string? Content { get; set; }         

        [MaxLength(500)]
        public string? FileUrl { get; set; }          

        public DateTime SubmittedAt { get; set; } = DateTime.UtcNow;

        public SubmissionStatus Status { get; set; } = SubmissionStatus.Submitted;

        public int? Score { get; set; }

        [MaxLength(1000)]
        public string? Feedback { get; set; }

        public DateTime? GradedAt { get; set; }

        public int AssignmentId { get; set; }
        public Assignment Assignment { get; set; } = null!;

        // The learner
        public int UserId { get; set; }
        public User User { get; set; } = null!;
    }
}