namespace Andalusia.Api.DTOs.Responses
{
    public class CareerPathDetailsResponseDto : CareerPathResponseDto
    {
        public string? Overview { get; set; }
        public string? RecommendedSkills { get; set; }
        public List<ProgramResponseDto> Programs { get; set; } = new();
        public List<CourseResponseDto> RecommendedCourses { get; set; } = new();
    }
}