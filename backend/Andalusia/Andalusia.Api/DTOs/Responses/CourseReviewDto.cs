namespace Andalusia.Api.DTOs.Responses
{
    public class CourseReviewDto
    {
        public int Id { get; set; }
        public int Rating { get; set; }
        public string? Comment { get; set; }
        public string AuthorName { get; set; } = string.Empty;
        public string? AuthorPhotoUrl { get; set; }
        public DateTime CreatedAt { get; set; }
        public DateTime? UpdatedAt { get; set; }
    }

    // GET /api/courses/5/reviews
    public class CourseReviewsDto
    {
        public double? AverageRating { get; set; }
        public int ReviewCount { get; set; }

        // How many 5-star, 4-star … 1-star reviews (index 0 = 5 stars)
        public List<int> StarCounts { get; set; } = new();
        public List<CourseReviewDto> Reviews { get; set; } = new();
    }
}
