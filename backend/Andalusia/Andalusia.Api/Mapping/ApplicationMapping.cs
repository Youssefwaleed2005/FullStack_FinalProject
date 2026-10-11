using Andalusia.Api.DTOs.Responses;
using Andalusia.Api.Models;

namespace Andalusia.Api.Mapping
{
    public static class ApplicationMapping
    {
        public static ApplicationResponseDto ToResponseDto(this Application application)
        {
            var isCourse = application.CourseId.HasValue;

            return new ApplicationResponseDto
            {
                Id = application.Id,
                Status = application.Status,
                Notes = application.Notes,
                CreatedAt = application.CreatedAt,
                ReviewedAt = application.ReviewedAt,

                TargetType = isCourse ? "Course" : "Program",
                CourseId = application.CourseId,
                ProgramId = application.ProgramId,
                TargetTitle = isCourse
                    ? application.Course?.Title ?? string.Empty
                    : application.Program?.Title ?? string.Empty,
                Price = isCourse
                    ? application.Course?.Price ?? 0
                    : application.Program?.Price ?? 0
            };
        }
    }
}