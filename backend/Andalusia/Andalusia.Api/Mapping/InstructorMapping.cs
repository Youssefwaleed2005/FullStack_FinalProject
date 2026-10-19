using Andalusia.Api.DTOs.Responses;
using Andalusia.Api.Enums;
using Andalusia.Api.Models;

namespace Andalusia.Api.Mapping
{
    public static class InstructorMapping
    {
        // Course (with Sessions + Assignments.Submissions loaded) → InstructorCourseDto
        public static InstructorCourseDto ToInstructorCourseDto(this Course course, int studentCount, DateTime now)
        {
            var upcoming = course.Sessions
                .Where(s => s.StartTime > now)
                .OrderBy(s => s.StartTime)
                .ToList();

            return new InstructorCourseDto
            {
                Id = course.Id,
                Title = course.Title,
                ImageUrl = course.ImageUrl,
                Status = course.Status,
                StartDate = course.StartDate,
                EndDate = course.EndDate,
                Location = course.Location,
                Schedule = course.Schedule,
                Capacity = course.Capacity,
                StudentCount = studentCount,
                SessionCount = course.Sessions.Count,
                UpcomingSessionCount = upcoming.Count,
                NextSessionAt = upcoming.FirstOrDefault()?.StartTime,
                AssignmentCount = course.Assignments.Count,
                PendingSubmissions = course.Assignments
                    .SelectMany(a => a.Submissions)
                    .Count(s => s.Status == SubmissionStatus.Submitted)
            };
        }

        // Session (with Course loaded) → UpcomingSessionDto
        public static UpcomingSessionDto ToUpcomingSessionDto(this Session session)
        {
            return new UpcomingSessionDto
            {
                Id = session.Id,
                CourseId = session.CourseId,
                CourseTitle = session.Course.Title,
                Title = session.Title,
                StartTime = session.StartTime,
                EndTime = session.EndTime,
                Location = session.Location
            };
        }
    }
}