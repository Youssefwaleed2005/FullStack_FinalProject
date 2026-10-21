using Andalusia.Api.DTOs.Responses;
using Andalusia.Api.Enums;
using Andalusia.Api.Exceptions;
using Andalusia.Api.Helpers;
using Andalusia.Api.Mapping;
using Andalusia.Api.Models;
using Andalusia.Api.Repos.Interfaces;
using Andalusia.Api.Services.Interfaces;

namespace Andalusia.Api.Services
{
    public class InstructorService : IInstructorService
    {
        private readonly IInstructorRepository _instructorRepository;

        public InstructorService(IInstructorRepository instructorRepository)
        {
            _instructorRepository = instructorRepository;
        }

        public async Task<InstructorDashboardDto> GetDashboardAsync(int instructorId)
        {
            var now = DateTime.UtcNow;
            var courses = await _instructorRepository.GetCoursesWithActivityAsync(instructorId);

            // Distinct learners across all my courses
            var studentIds = new HashSet<int>();
            foreach (var course in courses)
                studentIds.UnionWith(await _instructorRepository.GetActiveStudentIdsAsync(course.Id));

            var upcoming = courses
                .SelectMany(c => c.Sessions.Select(s => { s.Course = c; return s; }))
                .Where(s => s.StartTime > now)
                .OrderBy(s => s.StartTime)
                .ToList();

            return new InstructorDashboardDto
            {
                CourseCount = courses.Count,
                StudentCount = studentIds.Count,
                UpcomingSessionCount = upcoming.Count,
                PendingSubmissions = courses
                    .SelectMany(c => c.Assignments)
                    .SelectMany(a => a.Submissions)
                    .Count(s => s.Status == SubmissionStatus.Submitted),
                UpcomingSessions = upcoming
                    .Take(5)
                    .Select(s => s.ToUpcomingSessionDto())
                    .ToList()
            };
        }

        public async Task<List<InstructorCourseDto>> GetMyCoursesAsync(int instructorId)
        {
            var now = DateTime.UtcNow;
            var courses = await _instructorRepository.GetCoursesWithActivityAsync(instructorId);

            var result = new List<InstructorCourseDto>();
            foreach (var course in courses)
            {
                var students = await _instructorRepository.GetActiveStudentIdsAsync(course.Id);
                result.Add(course.ToInstructorCourseDto(students.Count, now));
            }
            return result;
        }

        public async Task<List<CourseStudentDto>> GetCourseStudentsAsync(int instructorId, int courseId)
        {
            await EnsureOwnsCourseAsync(instructorId, courseId);

            var now = DateTime.UtcNow;
            var course = (await _instructorRepository.GetCourseWithActivityAsync(courseId))!;
            var enrollments = await _instructorRepository.GetActiveEnrollmentsAsync(courseId);

            var pastSessions = course.Sessions.Where(s => s.StartTime <= now).ToList();
            var totalAssignments = course.Assignments.Count;
            var totalMaterials = course.Materials.Count;

            var result = new List<CourseStudentDto>();
            foreach (var enrollment in enrollments)
            {
                var user = enrollment.Application.User;

                var attended = pastSessions.Count(s => s.Attendances.Any(a =>
                    a.UserId == user.Id &&
                    (a.Status == AttendanceStatus.Present || a.Status == AttendanceStatus.Late)));

                var submissions = course.Assignments
                    .SelectMany(a => a.Submissions.Where(s => s.UserId == user.Id)
                        .Select(s => new { Submission = s, a.MaxScore }))
                    .ToList();

                var graded = submissions.Where(x => x.Submission.Score.HasValue).ToList();

                var completedMaterials = course.Materials.Count(m => m.Completions.Any(c => c.UserId == user.Id));

                result.Add(new CourseStudentDto
                {
                    UserId = user.Id,
                    FullName = $"{user.FirstName} {user.LastName}",
                    Email = user.Email,
                    EnrolledAt = enrollment.EnrolledAt,
                    AttendedSessions = attended,
                    PastSessions = pastSessions.Count,
                    SubmittedAssignments = submissions.Count,
                    TotalAssignments = totalAssignments,
                    CompletedMaterials = completedMaterials,
                    TotalMaterials = totalMaterials,
                    AverageScore = graded.Count == 0
                        ? null
                        : Math.Round(graded.Average(x => x.Submission.Score!.Value * 100.0 / x.MaxScore), 1),
                    ProgressPercent = ProgressCalculator.Calculate(
                        attended, pastSessions.Count, submissions.Count, totalAssignments,
                        completedMaterials, totalMaterials)
                });
            }
            return result;
        }

        public async Task<Course> EnsureOwnsCourseAsync(int instructorId, int courseId)
        {
            var course = await _instructorRepository.GetCourseAsync(courseId)
                ?? throw new NotFoundException($"Course with id {courseId} was not found.");

            if (course.InstructorId != instructorId)
                throw new ForbiddenException("You can only manage courses you teach.");

            return course;
        }
    }
}