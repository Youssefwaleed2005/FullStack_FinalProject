using Andalusia.Api.Mapping;
using Andalusia.Api.Models;

namespace Andalusia.Api.Tests
{
    public class ReviewMappingTests
    {
        private static CourseReview Review(int rating, string first = "Youssef", string last = "Waleed", DateTime? created = null) => new()
        {
            Rating = rating,
            Comment = "Nice course",
            CreatedAt = created ?? DateTime.UtcNow,
            User = new User { FirstName = first, LastName = last }
        };

        [Fact]
        public void No_reviews_has_no_average()
        {
            var summary = new List<CourseReview>().ToSummaryDto();

            Assert.Null(summary.AverageRating);
            Assert.Equal(0, summary.ReviewCount);
            Assert.Equal(new List<int> { 0, 0, 0, 0, 0 }, summary.StarCounts);
        }

        [Fact]
        public void Average_is_rounded_to_one_decimal()
        {
            var summary = new List<CourseReview> { Review(5), Review(4), Review(4) }.ToSummaryDto();

            Assert.Equal(4.3, summary.AverageRating);
            Assert.Equal(3, summary.ReviewCount);
        }

        [Fact]
        public void Star_counts_start_with_five_stars()
        {
            var summary = new List<CourseReview> { Review(5), Review(5), Review(3), Review(1) }.ToSummaryDto();

            Assert.Equal(new List<int> { 2, 0, 1, 0, 1 }, summary.StarCounts);
        }

        [Fact]
        public void Newest_review_comes_first()
        {
            var older = Review(2, created: DateTime.UtcNow.AddDays(-3));
            var newer = Review(5, created: DateTime.UtcNow);

            var summary = new List<CourseReview> { older, newer }.ToSummaryDto();

            Assert.Equal(5, summary.Reviews[0].Rating);
        }

        [Fact]
        public void Author_shows_first_name_and_last_initial()
        {
            Assert.Equal("Youssef W.", Review(5).ToDto().AuthorName);
        }
    }
}
