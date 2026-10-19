using Andalusia.Api.DTOs.Requests;
using Andalusia.Api.DTOs.Responses;
using Andalusia.Api.Models;

namespace Andalusia.Api.Mapping
{
    public static class SessionMapping
    {
        public static SessionResponseDto ToResponseDto(this Session session)
        {
            return new SessionResponseDto
            {
                Id = session.Id,
                CourseId = session.CourseId,
                Title = session.Title,
                Description = session.Description,
                StartTime = session.StartTime,
                EndTime = session.EndTime,
                Location = session.Location,
                IsPast = session.StartTime <= DateTime.UtcNow,
                AttendanceMarked = session.Attendances.Count
            };
        }

        public static Session ToEntity(this SessionRequestDto dto, int courseId)
        {
            return new Session
            {
                CourseId = courseId,
                Title = dto.Title.Trim(),
                Description = dto.Description,
                StartTime = dto.StartTime,
                EndTime = dto.EndTime,
                Location = dto.Location
            };
        }

        public static void UpdateEntity(this SessionRequestDto dto, Session session)
        {
            session.Title = dto.Title.Trim();
            session.Description = dto.Description;
            session.StartTime = dto.StartTime;
            session.EndTime = dto.EndTime;
            session.Location = dto.Location;
        }
    }
}