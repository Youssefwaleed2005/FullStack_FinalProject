using System.ComponentModel.DataAnnotations;
using Andalusia.Api.Enums;

namespace Andalusia.Api.Models
{
    public class Enrollment
    {
        public int Id { get; set; }

        public EnrollmentStatus Status { get; set; } = EnrollmentStatus.Active;

        public DateTime EnrolledAt { get; set; } = DateTime.UtcNow;

        public DateTime? ExpiresAt { get; set; }

        public DateTime? CompletedAt { get; set; }

        [Range(0, 100)]
        public int ProgressPercent { get; set; }

        // Which application this enrollment came from
        public int ApplicationId { get; set; }
        public Application Application { get; set; } = null!;
    }
}