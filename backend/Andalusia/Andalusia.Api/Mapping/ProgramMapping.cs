using Andalusia.Api.DTOs.Requests;
using Andalusia.Api.DTOs.Responses;
using Andalusia.Api.Models;

namespace Andalusia.Api.Mapping
{
    public static class ProgramMapping
    {
        // AcademyProgram → card DTO (program list)
        public static ProgramResponseDto ToResponseDto(this AcademyProgram program)
        {
            return new ProgramResponseDto
            {
                Id = program.Id,
                Title = program.Title,
                ShortDescription = program.ShortDescription,
                ImageUrl = program.ImageUrl,
                DurationWeeks = program.DurationWeeks,
                Price = program.Price,
                Location = program.Location,
                StartDate = program.StartDate,
                Status = program.Status,
                IsFeatured = program.IsFeatured,
                CategoryId = program.CategoryId,
                CategoryName = program.Category?.Name ?? string.Empty,
                CourseCount = program.ProgramCourses.Count
            };
        }

        // AcademyProgram → details DTO (program details page)
        public static ProgramDetailsResponseDto ToDetailsResponseDto(this AcademyProgram program)
        {
            return new ProgramDetailsResponseDto
            {
                Id = program.Id,
                Title = program.Title,
                ShortDescription = program.ShortDescription,
                ImageUrl = program.ImageUrl,
                DurationWeeks = program.DurationWeeks,
                Price = program.Price,
                Location = program.Location,
                StartDate = program.StartDate,
                Status = program.Status,
                IsFeatured = program.IsFeatured,
                CategoryId = program.CategoryId,
                CategoryName = program.Category?.Name ?? string.Empty,
                CourseCount = program.ProgramCourses.Count,

                // Extra details only fields
                Overview = program.Overview,
                Requirements = program.Requirements,
                PaymentInfo = program.PaymentInfo,
                Schedule = program.Schedule,
                EndDate = program.EndDate,
                Capacity = program.Capacity,

                // Included courses
                Courses = program.ProgramCourses
                    .OrderBy(pc => pc.SortOrder)
                    .Select(pc => new ProgramCourseResponseDto
                    {
                        CourseId = pc.CourseId,
                        Title = pc.Course?.Title ?? string.Empty,
                        ImageUrl = pc.Course?.ImageUrl,
                        DurationHours = pc.Course?.DurationHours ?? 0,
                        SortOrder = pc.SortOrder
                    })
                    .ToList()
            };
        }

        // Request DTO → new AcademyProgram 
        public static AcademyProgram ToEntity(this ProgramRequestDto dto)
        {
            return new AcademyProgram
            {
                Title = dto.Title.Trim(),
                ShortDescription = dto.ShortDescription,
                Overview = dto.Overview,
                Requirements = dto.Requirements,
                ImageUrl = dto.ImageUrl,
                DurationWeeks = dto.DurationWeeks,
                Price = dto.Price,
                PaymentInfo = dto.PaymentInfo,
                Location = dto.Location,
                Schedule = dto.Schedule,
                StartDate = dto.StartDate,
                EndDate = dto.EndDate,
                Capacity = dto.Capacity,
                Status = dto.Status,
                IsFeatured = dto.IsFeatured,
                CategoryId = dto.CategoryId
            };
        }

       
        public static void UpdateEntity(this ProgramRequestDto dto, AcademyProgram program)
        {
            program.Title = dto.Title.Trim();
            program.ShortDescription = dto.ShortDescription;
            program.Overview = dto.Overview;
            program.Requirements = dto.Requirements;
            program.ImageUrl = dto.ImageUrl;
            program.DurationWeeks = dto.DurationWeeks;
            program.Price = dto.Price;
            program.PaymentInfo = dto.PaymentInfo;
            program.Location = dto.Location;
            program.Schedule = dto.Schedule;
            program.StartDate = dto.StartDate;
            program.EndDate = dto.EndDate;
            program.Capacity = dto.Capacity;
            program.Status = dto.Status;
            program.IsFeatured = dto.IsFeatured;
            program.CategoryId = dto.CategoryId;
        }
    }
}