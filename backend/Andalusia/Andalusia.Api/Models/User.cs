using System.ComponentModel.DataAnnotations;

namespace Andalusia.Api.Models
{
    public class User
    {
        public int Id { get; set; }

        [Required]
        [MaxLength(50)]
        public string FirstName { get; set; } = string.Empty;

        [Required]
        [MaxLength(50)]
        public string LastName { get; set; } = string.Empty;

        [Required]
        [MaxLength(150)]
        public string Email { get; set; } = string.Empty;

        [Required]
        public string PasswordHash { get; set; } = string.Empty;

        [MaxLength(20)]
        public string? PhoneNumber { get; set; }

        [MaxLength(60)]
        public string? Country { get; set; }

        [MaxLength(30)]
        public string? PreferredLanguage { get; set; }

        public DateTime? TermsAcceptedAt { get; set; }

        public bool EmailConfirmed { get; set; }

        public bool IsActive { get; set; } = true;

        // Instructor-only fields (empty for learners)
        [MaxLength(100)]
        public string? Specialization { get; set; }

        public string? Bio { get; set; }

        [MaxLength(300)]
        public string? PhotoUrl { get; set; }

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        // Courses this user teaches (only for instructors)
        public ICollection<Course> CoursesTaught { get; set; } = new List<Course>();
        public ICollection<UserRole> UserRoles { get; set; } = new List<UserRole>();
        public ICollection<Application> Applications { get; set; } = new List<Application>();
    }
}