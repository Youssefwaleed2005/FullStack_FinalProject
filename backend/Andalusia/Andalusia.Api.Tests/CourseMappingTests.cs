using Andalusia.Api.Mapping;
using Andalusia.Api.Models;

namespace Andalusia.Api.Tests
{
    public class CourseMappingTests
    {
        private static Course NewCourse() => new()
        {
            Id = 1,
            Title = "React from Scratch",
            Category = new Category { Name = "Web Development" },
            Instructor = new User { FirstName = "Demo", LastName = "Instructor" }
        };

        [Fact]
        public void Card_shows_category_and_instructor_names()
        {
            var dto = NewCourse().ToResponseDto();

            Assert.Equal("Web Development", dto.CategoryName);
            Assert.Equal("Demo Instructor", dto.InstructorName);
        }

        [Fact]
        public void Course_without_reviews_has_no_rating()
        {
            var dto = NewCourse().ToResponseDto();

            Assert.Null(dto.AverageRating);
            Assert.Equal(0, dto.ReviewCount);
        }

        [Fact]
        public void Rating_is_the_average_of_the_reviews()
        {
            var course = NewCourse();
            course.Reviews.Add(new CourseReview { Rating = 5 });
            course.Reviews.Add(new CourseReview { Rating = 3 });

            var dto = course.ToResponseDto();

            Assert.Equal(4.0, dto.AverageRating);
            Assert.Equal(2, dto.ReviewCount);
        }

        [Fact]
        public void Archived_flag_is_passed_to_the_admin_list()
        {
            var course = NewCourse();
            course.IsDeleted = true;

            Assert.True(course.ToResponseDto().IsDeleted);
        }
    }
}
