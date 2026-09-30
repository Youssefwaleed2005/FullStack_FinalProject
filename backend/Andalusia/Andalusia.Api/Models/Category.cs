using System.ComponentModel.DataAnnotations;

namespace Andalusia.Api.Models
{
    public class Category
    {
        public int Id { get; set; }

        [Required]
        [MaxLength(100)]
        public string Name { get; set; } = string.Empty;

        [MaxLength(500)]
        public string? Description { get; set; }

        [MaxLength(300)]
        public string? IconUrl { get; set; }

        public bool IsFeatured { get; set; }

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    
        public ICollection<Course> Courses { get; set; } = new List<Course>();
        public ICollection<AcademyProgram> Programs { get; set; } = new List<AcademyProgram>();
    }
}
