using System.ComponentModel.DataAnnotations;
using Andalusia.Api.Enums;

namespace Andalusia.Api.DTOs.Requests
{
    public class CourseRequestDto
    {
        [Required(ErrorMessage = "Course title is required.")]
        [MaxLength(200, ErrorMessage = "Course title cannot exceed 200 characters.")]
        public string Title { get; set; } = string.Empty;

        [MaxLength(500)]
        public string? ShortDescription { get; set; }

        public string? FullDescription { get; set; }

        public string? Objectives { get; set; }

        [MaxLength(300)]
        public string? ImageUrl { get; set; }

        [Range(1, 1000, ErrorMessage = "Duration must be between 1 and 1000 hours.")]
        public int DurationHours { get; set; }

        [Range(0, 1000000, ErrorMessage = "Price must be between 0 and 1,000,000.")]
        public decimal Price { get; set; }

        [MaxLength(200)]
        public string? Location { get; set; }

        [MaxLength(200)]
        public string? Schedule { get; set; }

        public DateOnly? StartDate { get; set; }
        public DateOnly? EndDate { get; set; }

        [Range(1, 1000, ErrorMessage = "Capacity must be between 1 and 1000 students.")]
        public int Capacity { get; set; }

        [EnumDataType(typeof(CourseType), ErrorMessage = "Invalid course type.")]
        public CourseType Type { get; set; } = CourseType.Offline;

        [EnumDataType(typeof(CatalogStatus), ErrorMessage = "Invalid course status.")]
        public CatalogStatus Status { get; set; } = CatalogStatus.Draft;

        public bool IsFeatured { get; set; }

        [Range(1, int.MaxValue, ErrorMessage = "Please choose a category.")]
        public int CategoryId { get; set; }

        public int? InstructorId { get; set; }
    }
}