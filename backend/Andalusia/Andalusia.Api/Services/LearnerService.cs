using Andalusia.Api.DTOs.Requests;
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
    public class LearnerService : ILearnerService
    {
        private readonly ILearnerRepository _learnerRepository;

        public LearnerService(ILearnerRepository learnerRepository)
        {
            _learnerRepository = learnerRepository;
        }

        // How a learner reaches a course: enrollment status + the program it came through (null = direct)
        private record CourseAccess(EnrollmentStatus Status, string? ProgramTitle);

        // ---------- Dashboard + course list ----------

        public async Task<LearnerDashboardDto> GetDashboardAsync(int userId)
        {
            var now = DateTime.UtcNow;
            var (courses, access) = await LoadMyCoursesAsync(userId);
            var courseDtos = ToCourseDtos(courses, access, now);

            // Upcoming sessions only from courses I'm actively taking
            var upcoming = courses
                .Where(c => access[c.Id].Status == EnrollmentStatus.Active)
                .SelectMany(c => c.Sessions
                    .Where(s => s.StartTime > now)
                    .Select(s => s.ToUpcomingDto(c.Title)))
                .OrderBy(s => s.StartTime)
                .ToList();

            var activeCourses = courseDtos.Where(c => c.EnrollmentStatus == EnrollmentStatus.Active).ToList();

            return new LearnerDashboardDto
            {
                ActiveCourseCount = activeCourses.Count,
                UpcomingSessionCount = upcoming.Count,
                PendingAssignmentCount = activeCourses.Sum(c => c.PendingAssignments),
                AverageProgress = courseDtos.Count == 0
                    ? 0
                    : (int)Math.Round(courseDtos.Average(c => c.ProgressPercent)),
                UpcomingSessions = upcoming.Take(5).ToList(),
                Courses = courseDtos
            };
        }

        public async Task<List<LearnerCourseDto>> GetMyCoursesAsync(int userId)
        {
            var (courses, access) = await LoadMyCoursesAsync(userId);
            return ToCourseDtos(courses, access, DateTime.UtcNow);
        }

        // ---------- One course ----------

        public async Task<LearnerCourseDetailDto> GetCourseAsync(int userId, int courseId)
        {
            var access = await EnsureCanAccessCourseAsync(userId, courseId);
            var course = (await _learnerRepository.GetCourseWithMyActivityAsync(courseId, userId))!;

            return course.ToLearnerCourseDetailDto(
                access.Status, access.ProgramTitle, CalculateProgress(course, DateTime.UtcNow));
        }

        public async Task<List<LearnerSessionDto>> GetSessionsAsync(int userId, int courseId)
        {
            await EnsureCanAccessCourseAsync(userId, courseId);
            var course = (await _learnerRepository.GetCourseWithMyActivityAsync(courseId, userId))!;

            var now = DateTime.UtcNow;
            return course.Sessions
                .OrderBy(s => s.StartTime)
                .Select(s => s.ToLearnerSessionDto(now))
                .ToList();
        }

        // Oldest first (week 1 at the top), each with "did I finish it?"
        public async Task<List<LearnerMaterialDto>> GetMaterialsAsync(int userId, int courseId)
        {
            await EnsureCanAccessCourseAsync(userId, courseId);
            var course = (await _learnerRepository.GetCourseWithMyActivityAsync(courseId, userId))!;

            return course.Materials
                .OrderBy(m => m.CreatedAt)
                .Select(m => m.ToLearnerMaterialDto())
                .ToList();
        }

        // ---------- Mark a material done / not done ----------

        public async Task<MaterialCompletionResultDto> SetMaterialCompletionAsync(int userId, int materialId, bool completed)
        {
            var material = await _learnerRepository.GetMaterialAsync(materialId)
                ?? throw new NotFoundException($"Material with id {materialId} was not found.");

            var access = await EnsureCanAccessCourseAsync(userId, material.CourseId);
            if (access.Status != EnrollmentStatus.Active)
                throw new ForbiddenException("Your enrollment in this course is not active.");

            var existing = await _learnerRepository.GetMyCompletionAsync(materialId, userId);

            if (completed && existing == null)
            {
                await _learnerRepository.AddCompletionAsync(new MaterialCompletion
                {
                    MaterialId = materialId,
                    UserId = userId
                });
                await _learnerRepository.SaveChangesAsync();
            }
            else if (!completed && existing != null)
            {
                _learnerRepository.RemoveCompletion(existing);
                await _learnerRepository.SaveChangesAsync();
            }

            // Fresh progress so the page can move the bar straight away
            var course = (await _learnerRepository.GetCourseWithMyActivityAsync(material.CourseId, userId))!;
            return new MaterialCompletionResultDto
            {
                MaterialId = materialId,
                IsCompleted = completed,
                Progress = CalculateProgress(course, DateTime.UtcNow)
            };
        }

        public async Task<List<LearnerAssignmentDto>> GetAssignmentsAsync(int userId, int courseId)
        {
            await EnsureCanAccessCourseAsync(userId, courseId);
            var course = (await _learnerRepository.GetCourseWithMyActivityAsync(courseId, userId))!;

            var now = DateTime.UtcNow;
            return course.Assignments
                .OrderBy(a => a.DueDate)
                .Select(a => a.ToLearnerAssignmentDto(now))
                .ToList();
        }

        // ---------- Submit (create or update) ----------

        public async Task<MySubmissionDto> SubmitAsync(int userId, int assignmentId, SubmitAssignmentRequestDto dto)
        {
            var content = string.IsNullOrWhiteSpace(dto.Content) ? null : dto.Content.Trim();
            var fileUrl = string.IsNullOrWhiteSpace(dto.FileUrl) ? null : dto.FileUrl.Trim();

            if (content == null && fileUrl == null)
                throw new BadRequestException("Write an answer or add a link before submitting.");

            var assignment = await _learnerRepository.GetAssignmentAsync(assignmentId)
                ?? throw new NotFoundException($"Assignment with id {assignmentId} was not found.");

            var access = await EnsureCanAccessCourseAsync(userId, assignment.CourseId);
            if (access.Status != EnrollmentStatus.Active)
                throw new ForbiddenException("Your enrollment in this course is not active, so you can't submit.");

            var submission = await _learnerRepository.GetMySubmissionAsync(assignmentId, userId);

            if (submission == null)
            {
                submission = new Submission
                {
                    AssignmentId = assignmentId,
                    UserId = userId,
                    Content = content,
                    FileUrl = fileUrl
                };
                await _learnerRepository.AddSubmissionAsync(submission);
            }
            else
            {
                // Rule: you can edit until the instructor grades it
                if (submission.Status == SubmissionStatus.Graded)
                    throw new ConflictException("This assignment is already graded, so it can't be changed.");

                submission.Content = content;
                submission.FileUrl = fileUrl;
                submission.SubmittedAt = DateTime.UtcNow;
            }

            await _learnerRepository.SaveChangesAsync();
            return submission.ToMySubmissionDto(assignment.DueDate);
        }

        // ---------- Progress for "My learning" ----------

        public async Task<Dictionary<int, int>> GetEnrollmentProgressAsync(int userId)
        {
            var now = DateTime.UtcNow;
            var enrollments = await _learnerRepository.GetMyEnrollmentsAsync(userId);

            var courseIds = enrollments.SelectMany(e => CourseIdsOf(e.Application)).Distinct().ToList();
            var courses = await _learnerRepository.GetCoursesWithMyActivityAsync(courseIds, userId);
            var progressByCourse = courses.ToDictionary(c => c.Id, c => CalculateProgress(c, now).ProgressPercent);

            // Course enrollment = that course's %, program enrollment = average of its courses
            var result = new Dictionary<int, int>();
            foreach (var enrollment in enrollments)
            {
                var values = CourseIdsOf(enrollment.Application)
                    .Where(progressByCourse.ContainsKey)
                    .Select(id => progressByCourse[id])
                    .ToList();

                result[enrollment.Id] = values.Count == 0 ? 0 : (int)Math.Round(values.Average());
            }
            return result;
        }

        // ---------- Helpers ----------

        // Not found (404) vs not enrolled (403)
        private async Task<CourseAccess> EnsureCanAccessCourseAsync(int userId, int courseId)
        {
            var access = await GetCourseAccessAsync(userId);
            if (access.TryGetValue(courseId, out var found))
                return found;

            if (!await _learnerRepository.CourseExistsAsync(courseId))
                throw new NotFoundException($"Course with id {courseId} was not found.");

            throw new ForbiddenException("You are not enrolled in this course.");
        }

        // courseId → best access. Active beats Completed; direct beats "through a program"
        private async Task<Dictionary<int, CourseAccess>> GetCourseAccessAsync(int userId)
        {
            var enrollments = await _learnerRepository.GetMyEnrollmentsAsync(userId);
            var access = new Dictionary<int, CourseAccess>();

            foreach (var enrollment in enrollments)
            {
                var application = enrollment.Application;
                var programTitle = application.CourseId.HasValue ? null : application.Program?.Title;
                var candidate = new CourseAccess(enrollment.Status, programTitle);

                foreach (var courseId in CourseIdsOf(application))
                {
                    if (!access.TryGetValue(courseId, out var current) || IsBetter(candidate, current))
                        access[courseId] = candidate;
                }
            }
            return access;
        }

        private static bool IsBetter(CourseAccess candidate, CourseAccess current)
        {
            if (candidate.Status != current.Status)
                return candidate.Status == EnrollmentStatus.Active;

            return candidate.ProgramTitle == null && current.ProgramTitle != null;
        }

        // A course application → that course; a program application → its courses
        private static List<int> CourseIdsOf(Application application)
        {
            if (application.CourseId.HasValue)
                return new List<int> { application.CourseId.Value };

            return application.Program?.ProgramCourses.Select(pc => pc.CourseId).ToList()
                ?? new List<int>();
        }

        private async Task<(List<Course> Courses, Dictionary<int, CourseAccess> Access)> LoadMyCoursesAsync(int userId)
        {
            var access = await GetCourseAccessAsync(userId);
            if (access.Count == 0)
                return (new List<Course>(), access);

            var courses = await _learnerRepository.GetCoursesWithMyActivityAsync(access.Keys.ToList(), userId);
            return (courses, access);
        }

        private static List<LearnerCourseDto> ToCourseDtos(
            List<Course> courses, Dictionary<int, CourseAccess> access, DateTime now)
        {
            return courses
                .Select(c => c.ToLearnerCourseDto(
                    access[c.Id].Status, access[c.Id].ProgramTitle, CalculateProgress(c, now), now))
                .ToList();
        }

        // Same rules as InstructorService.GetCourseStudentsAsync, so both sides show the same %
        private static LearnerProgressDto CalculateProgress(Course course, DateTime now)
        {
            var pastSessions = course.Sessions.Where(s => s.StartTime <= now).ToList();

            var attended = pastSessions.Count(s => s.Attendances.Any(a =>
                a.Status == AttendanceStatus.Present || a.Status == AttendanceStatus.Late));

            var submitted = course.Assignments.Count(a => a.Submissions.Any());
            var completedMaterials = course.Materials.Count(m => m.Completions.Any());

            var gradedPercents = course.Assignments
                .SelectMany(a => a.Submissions
                    .Where(s => s.Score.HasValue)
                    .Select(s => s.Score!.Value * 100.0 / a.MaxScore))
                .ToList();

            return new LearnerProgressDto
            {
                AttendedSessions = attended,
                PastSessions = pastSessions.Count,
                SubmittedAssignments = submitted,
                TotalAssignments = course.Assignments.Count,
                CompletedMaterials = completedMaterials,
                TotalMaterials = course.Materials.Count,
                AverageScore = gradedPercents.Count == 0 ? null : Math.Round(gradedPercents.Average(), 1),
                ProgressPercent = ProgressCalculator.Calculate(
                    attended, pastSessions.Count, submitted, course.Assignments.Count,
                    completedMaterials, course.Materials.Count)
            };
        }
    }
}