using System.ComponentModel.DataAnnotations;

namespace Andalusia.Api.Models
{
    
    public class Session
    {
        public int Id { get; set; }

        [Required]
        [MaxLength(200)]
        public string Title { get; set; } = string.Empty;

        [MaxLength(1000)]
        public string? Description { get; set; }

        public DateTime StartTime { get; set; }
        public DateTime EndTime { get; set; }

        [MaxLength(200)]
        public string? Location { get; set; }   

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        public int CourseId { get; set; }
        public Course Course { get; set; } = null!;

        public ICollection<Attendance> Attendances { get; set; } = new List<Attendance>();
    }
}