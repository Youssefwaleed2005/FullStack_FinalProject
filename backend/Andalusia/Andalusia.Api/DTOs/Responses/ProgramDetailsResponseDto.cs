namespace Andalusia.Api.DTOs.Responses
{
    public class ProgramDetailsResponseDto : ProgramResponseDto
    {
        public string? Overview { get; set; }
        public string? Requirements { get; set; }
        public string? PaymentInfo { get; set; }
        public string? Schedule { get; set; }
        public DateOnly? EndDate { get; set; }
        public int Capacity { get; set; }

        public List<ProgramCourseResponseDto> Courses { get; set; } = new();
    }
}