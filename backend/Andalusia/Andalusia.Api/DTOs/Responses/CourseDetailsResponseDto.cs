namespace Andalusia.Api.DTOs.Responses
{
    public class CourseDetailsResponseDto : CourseResponseDto
    {
        public string? FullDescription { get; set; }
        public string? Objectives { get; set; }
        public string? Schedule { get; set; }
        public DateOnly? EndDate { get; set; }
        public int Capacity { get; set; }
        public string? InstructorBio { get; set; }
        public string? InstructorPhotoUrl { get; set; }
    }
}