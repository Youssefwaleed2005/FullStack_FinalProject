using System.ComponentModel.DataAnnotations;

namespace Andalusia.Api.Models
{
    // A learner's star rating (1-5) and comment for a course they are enrolled in. One per learner per course.
    public class CourseReview
    {
        public int Id { get; set; }

        [Range(1, 5)]
        public int Rating { get; set; }

        [MaxLength(1000)]
        public string? Comment { get; set; }

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public DateTime? UpdatedAt { get; set; }

        public int CourseId { get; set; }
        public Course Course { get; set; } = null!;

        public int UserId { get; set; }
        public User User { get; set; } = null!;
    }
}
