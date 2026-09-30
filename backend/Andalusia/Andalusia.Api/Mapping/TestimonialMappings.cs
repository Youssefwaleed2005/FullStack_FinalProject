using Andalusia.Api.DTOs.Requests;
using Andalusia.Api.DTOs.Responses;
using Andalusia.Api.Models;

namespace Andalusia.Api.Mapping
{
    public static class TestimonialMapping
    {
        public static TestimonialResponseDto ToResponseDto(this Testimonial testimonial)
        {
            return new TestimonialResponseDto
            {
                Id = testimonial.Id,
                AuthorName = testimonial.AuthorName,
                AuthorTitle = testimonial.AuthorTitle,
                PhotoUrl = testimonial.PhotoUrl,
                Content = testimonial.Content
            };
        }

        public static Testimonial ToEntity(this TestimonialRequestDto dto)
        {
            return new Testimonial
            {
                AuthorName = dto.AuthorName.Trim(),
                AuthorTitle = dto.AuthorTitle?.Trim(),
                PhotoUrl = dto.PhotoUrl,
                Content = dto.Content.Trim(),
                Rating = dto.Rating,
                IsPublished = dto.IsPublished
            };
        }

        public static void UpdateEntity(this TestimonialRequestDto dto, Testimonial testimonial)
        {
            testimonial.AuthorName = dto.AuthorName.Trim();
            testimonial.AuthorTitle = dto.AuthorTitle?.Trim();
            testimonial.PhotoUrl = dto.PhotoUrl;
            testimonial.Content = dto.Content.Trim();
            testimonial.Rating = dto.Rating;
            testimonial.IsPublished = dto.IsPublished;
        }
    }
}