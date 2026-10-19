using System.ComponentModel.DataAnnotations;

namespace Andalusia.Api.Models
{
    
    public class Assignment
    {
        public int Id { get; set; }

        [Required]
        [MaxLength(200)]
        public string Title { get; set; } = string.Empty;

        public string? Description { get; set; }

        public DateTime DueDate { get; set; }

        [Range(1, 1000)]
        public int MaxScore { get; set; } = 100;

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        public int CourseId { get; set; }
        public Course Course { get; set; } = null!;

        public ICollection<Submission> Submissions { get; set; } = new List<Submission>();
    }
}