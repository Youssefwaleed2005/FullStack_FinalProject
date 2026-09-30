using Andalusia.Api.Enums;

namespace Andalusia.Api.DTOs.Responses
{
    public class ProgramResponseDto
    {
        public int Id { get; set; }
        public string Title { get; set; } = string.Empty;
        public string? ShortDescription { get; set; }
        public string? ImageUrl { get; set; }
        public int DurationWeeks { get; set; }
        public decimal Price { get; set; }
        public string? Location { get; set; }
        public DateOnly? StartDate { get; set; }
        public CatalogStatus Status { get; set; }
        public bool IsFeatured { get; set; }

        public int CategoryId { get; set; }
        public string CategoryName { get; set; } = string.Empty;

        public int CourseCount { get; set; }
    }
}