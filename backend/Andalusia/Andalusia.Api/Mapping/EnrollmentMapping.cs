using Andalusia.Api.DTOs.Responses;
using Andalusia.Api.Models;

namespace Andalusia.Api.Mapping
{
    public static class EnrollmentMapping
    {
        public static EnrollmentResponseDto ToResponseDto(this Enrollment enrollment)
        {
            var application = enrollment.Application;
            var isCourse = application?.CourseId.HasValue ?? false;

            return new EnrollmentResponseDto
            {
                Id = enrollment.Id,
                Status = enrollment.Status,
                EnrolledAt = enrollment.EnrolledAt,
                ProgressPercent = enrollment.ProgressPercent,
                ApplicationId = enrollment.ApplicationId,

                TargetType = isCourse ? "Course" : "Program",
                CourseId = application?.CourseId,
                ProgramId = application?.ProgramId,
                TargetTitle = isCourse
                    ? application?.Course?.Title ?? string.Empty
                    : application?.Program?.Title ?? string.Empty,
                ImageUrl = isCourse
                    ? application?.Course?.ImageUrl
                    : application?.Program?.ImageUrl
            };
        }
    }
}