using Andalusia.Api.DTOs.Responses;
using Andalusia.Api.Models;

namespace Andalusia.Api.Mapping
{
    public static class ReviewMapping
    {
        public static CourseReviewDto ToDto(this CourseReview review)
        {
            return new CourseReviewDto
            {
                Id = review.Id,
                Rating = review.Rating,
                Comment = review.Comment,
                // First name + last initial, e.g. "Youssef W."
                AuthorName = review.User == null
                    ? "Learner"
                    : $"{review.User.FirstName} {(review.User.LastName.Length > 0 ? review.User.LastName[0] + "." : "")}".Trim(),
                AuthorPhotoUrl = review.User?.PhotoUrl,
                CreatedAt = review.CreatedAt,
                UpdatedAt = review.UpdatedAt
            };
        }

        public static CourseReviewsDto ToSummaryDto(this List<CourseReview> reviews)
        {
            return new CourseReviewsDto
            {
                AverageRating = reviews.Count == 0 ? null : Math.Round(reviews.Average(r => r.Rating), 1),
                ReviewCount = reviews.Count,
                StarCounts = Enumerable.Range(0, 5).Select(i => reviews.Count(r => r.Rating == 5 - i)).ToList(),
                Reviews = reviews.OrderByDescending(r => r.UpdatedAt ?? r.CreatedAt).Select(r => r.ToDto()).ToList()
            };
        }
    }
}
