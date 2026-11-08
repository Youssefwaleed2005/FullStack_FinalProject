using System.ComponentModel.DataAnnotations;

namespace Andalusia.Api.DTOs.Requests
{
    // PUT /api/learner/courses/5/review   { "rating": 5, "comment": "Loved it" }
    public class CourseReviewRequestDto
    {
        [Range(1, 5, ErrorMessage = "Choose between 1 and 5 stars.")]
        public int Rating { get; set; }

        [MaxLength(1000, ErrorMessage = "The comment can be at most 1000 characters.")]
        public string? Comment { get; set; }
    }
}
