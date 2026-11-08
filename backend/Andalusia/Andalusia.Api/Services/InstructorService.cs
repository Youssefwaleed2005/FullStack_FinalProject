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

        public async Task<CourseInsightsDto> GetCourseInsightsAsync(int instructorId, int courseId)
        {
            // Also checks that I teach this course
            var students = await GetCourseStudentsAsync(instructorId, courseId);
            var course = (await _instructorRepository.GetCourseWithActivityAsync(courseId))!;
            var studentIds = students.Select(s => s.UserId).ToHashSet();
            var now = DateTime.UtcNow;

            var buckets = new[] { ("0–24%", 0, 24), ("25–49%", 25, 49), ("50–74%", 50, 74), ("75–100%", 75, 100) }
                .Select(b => new LabelCountDto
                {
                    Label = b.Item1,
                    Count = students.Count(s => s.ProgressPercent >= b.Item2 && s.ProgressPercent <= b.Item3)
                })
                .ToList();

            // Weeks start on Sunday; the last one is the current week
            var thisWeek = now.Date.AddDays(-(int)now.DayOfWeek);
            var submissions = course.Assignments
                .SelectMany(a => a.Submissions)
                .Where(s => studentIds.Contains(s.UserId))
                .ToList();
            var byWeek = Enumerable.Range(0, 8)
                .Select(i => thisWeek.AddDays(-7 * (7 - i)))
                .Select(start => new LabelCountDto
                {
                    Label = start.ToString("dd MMM"),
                    Count = submissions.Count(s => s.SubmittedAt >= start && s.SubmittedAt < start.AddDays(7))
                })
                .ToList();

            var attendance = course.Sessions
                .Where(s => s.StartTime <= now)
                .OrderByDescending(s => s.StartTime)
                .Take(8)
                .OrderBy(s => s.StartTime)
                .Select(s => new SessionAttendanceRateDto
                {
                    Title = s.Title,
                    StartTime = s.StartTime,
                    Attended = s.Attendances.Count(a => studentIds.Contains(a.UserId)
                        && (a.Status == AttendanceStatus.Present || a.Status == AttendanceStatus.Late)),
                    Total = students.Count
                })
                .ToList();

            var scores = students.Where(s => s.AverageScore.HasValue).Select(s => s.AverageScore!.Value).ToList();

            return new CourseInsightsDto
            {
                StudentCount = students.Count,
                AverageProgress = students.Count == 0 ? 0 : (int)Math.Round(students.Average(s => s.ProgressPercent)),
                AverageScore = scores.Count == 0 ? null : (int)Math.Round(scores.Average()),
                ProgressBuckets = buckets,
                SubmissionsByWeek = byWeek,
                AttendanceBySession = attendance,
                AtRisk = students
                    .Where(s => s.ProgressPercent < 40)
                    .OrderBy(s => s.ProgressPercent)
                    .Select(s => new AtRiskStudentDto
                    {
                        UserId = s.UserId,
                        FullName = s.FullName,
                        Email = s.Email,
                        ProgressPercent = s.ProgressPercent,
                        MissedSessions = s.PastSessions - s.AttendedSessions,
                        MissingAssignments = s.TotalAssignments - s.SubmittedAssignments
                    })
                    .ToList()
            };
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