using Andalusia.Api.DTOs.Requests;
using Andalusia.Api.DTOs.Responses;
using Andalusia.Api.Models;

namespace Andalusia.Api.Mapping
{
    public static class CourseMapping
    {
        // Course → card DTO (course list)
        public static CourseResponseDto ToResponseDto(this Course course)
        {
            return new CourseResponseDto
            {
                Id = course.Id,
                Title = course.Title,
                ShortDescription = course.ShortDescription,
                ImageUrl = course.ImageUrl,
                DurationHours = course.DurationHours,
                Price = course.Price,
                Location = course.Location,
                StartDate = course.StartDate,
                Type = course.Type,
                Status = course.Status,
                IsFeatured = course.IsFeatured,
                CategoryId = course.CategoryId,
                CategoryName = course.Category?.Name ?? string.Empty,
                InstructorId = course.InstructorId,
                InstructorName = course.Instructor == null
                    ? null
                    : $"{course.Instructor.FirstName} {course.Instructor.LastName}"
            };
        }

        
        public static CourseDetailsResponseDto ToDetailsResponseDto(this Course course)
        {
            return new CourseDetailsResponseDto
            {
                Id = course.Id,
                Title = course.Title,
                ShortDescription = course.ShortDescription,
                ImageUrl = course.ImageUrl,
                DurationHours = course.DurationHours,
                Price = course.Price,
                Location = course.Location,
                StartDate = course.StartDate,
                Type = course.Type,
                Status = course.Status,
                IsFeatured = course.IsFeatured,
                CategoryId = course.CategoryId,
                CategoryName = course.Category?.Name ?? string.Empty,
                InstructorId = course.InstructorId,
                InstructorName = course.Instructor == null
                    ? null
                    : $"{course.Instructor.FirstName} {course.Instructor.LastName}",

                FullDescription = course.FullDescription,
                Objectives = course.Objectives,
                Schedule = course.Schedule,
                EndDate = course.EndDate,
                Capacity = course.Capacity,
                InstructorBio = course.Instructor?.Bio,
                InstructorPhotoUrl = course.Instructor?.PhotoUrl
            };
        }

        
        public static Course ToEntity(this CourseRequestDto dto)
        {
            return new Course
            {
                Title = dto.Title.Trim(),
                ShortDescription = dto.ShortDescription,
                FullDescription = dto.FullDescription,
                Objectives = dto.Objectives,
                ImageUrl = dto.ImageUrl,
                DurationHours = dto.DurationHours,
                Price = dto.Price,
                Location = dto.Location,
                Schedule = dto.Schedule,
                StartDate = dto.StartDate,
                EndDate = dto.EndDate,
                Capacity = dto.Capacity,
                Type = dto.Type,
                Status = dto.Status,
                IsFeatured = dto.IsFeatured,
                CategoryId = dto.CategoryId,
                InstructorId = dto.InstructorId
            };
        }

        
        public static void UpdateEntity(this CourseRequestDto dto, Course course)
        {
            course.Title = dto.Title.Trim();
            course.ShortDescription = dto.ShortDescription;
            course.FullDescription = dto.FullDescription;
            course.Objectives = dto.Objectives;
            course.ImageUrl = dto.ImageUrl;
            course.DurationHours = dto.DurationHours;
            course.Price = dto.Price;
            course.Location = dto.Location;
            course.Schedule = dto.Schedule;
            course.StartDate = dto.StartDate;
            course.EndDate = dto.EndDate;
            course.Capacity = dto.Capacity;
            course.Type = dto.Type;
            course.Status = dto.Status;
            course.IsFeatured = dto.IsFeatured;
            course.CategoryId = dto.CategoryId;
            course.InstructorId = dto.InstructorId;
        }
    }
}