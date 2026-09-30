using System.ComponentModel.DataAnnotations;
using Andalusia.Api.Enums;

namespace Andalusia.Api.Models
{
    public class Application
    {
        public int Id { get; set; }

        public ApplicationStatus Status { get; set; } = ApplicationStatus.Submitted;

        [MaxLength(1000)]
        public string? Notes { get; set; }

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        public DateTime? ReviewedAt { get; set; }

        // Who applied
        public int UserId { get; set; }
        public User User { get; set; } = null!;

        // What they applied to: a Course OR a Program (exactly one)
        public int? CourseId { get; set; }
        public Course? Course { get; set; }

        public int? ProgramId { get; set; }
        public AcademyProgram? Program { get; set; }
        public ICollection<Payment> Payments { get; set; } = new List<Payment>();
        public Enrollment? Enrollment { get; set; }
    }
}