using System.ComponentModel.DataAnnotations;
using Microsoft.EntityFrameworkCore;
using Andalusia.Api.Enums;

namespace Andalusia.Api.Models
{
    public class AcademyProgram
    {
        public int Id { get; set; }

        [Required]
        [MaxLength(200)]
        public string Title { get; set; } = string.Empty;

        [MaxLength(500)]
        public string? ShortDescription { get; set; }

        public string? Overview { get; set; }

        public string? Requirements { get; set; }

        [MaxLength(300)]
        public string? ImageUrl { get; set; }

        public int DurationWeeks { get; set; }

        [Precision(10, 2)]
        public decimal Price { get; set; }

        [MaxLength(500)]
        public string? PaymentInfo { get; set; }

        [MaxLength(200)]
        public string? Location { get; set; }

        [MaxLength(200)]
        public string? Schedule { get; set; }

        public DateOnly? StartDate { get; set; }
        public DateOnly? EndDate { get; set; }

        public int Capacity { get; set; }

        public CatalogStatus Status { get; set; } = CatalogStatus.Draft;

        public bool IsFeatured { get; set; }

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        public int CategoryId { get; set; }
        public Category Category { get; set; } = null!;

        public ICollection<ProgramCourse> ProgramCourses { get; set; } = new List<ProgramCourse>();
        public ICollection<CareerPathProgram> CareerPathPrograms { get; set; } = new List<CareerPathProgram>();
        public ICollection<Application> Applications { get; set; } = new List<Application>();
    }
}