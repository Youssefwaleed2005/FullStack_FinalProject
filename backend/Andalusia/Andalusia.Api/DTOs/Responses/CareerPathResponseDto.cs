namespace Andalusia.Api.DTOs.Responses
{
    public class CareerPathResponseDto
    {
        public int Id { get; set; }
        public string Title { get; set; } = string.Empty;
        public string? ShortDescription { get; set; }
        public string? ImageUrl { get; set; }
        public bool IsFeatured { get; set; }
        public int ProgramCount { get; set; }
    }
}