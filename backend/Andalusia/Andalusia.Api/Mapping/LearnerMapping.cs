using Andalusia.Api.DTOs.Responses;
using Andalusia.Api.Enums;
using Andalusia.Api.Models;

namespace Andalusia.Api.Mapping
{
    public static class LearnerMapping
    {
        // Course (with Instructor, Sessions, Assignments + MY submissions) → card
        public static LearnerCourseDto ToLearnerCourseDto(
            this Course course, EnrollmentStatus status, string? programTitle,
            LearnerProgressDto progress, DateTime now)
        {
            return new LearnerCourseDto
            {
                Id = course.Id,
                Title = course.Title,
                ImageUrl = course.ImageUrl,
                Status = course.Status,
                StartDate = course.StartDate,
                EndDate = course.EndDate,
                Schedule = course.Schedule,
                Location = course.Location,
                InstructorName = course.Instructor == null
                    ? null
                    : $"{course.Instructor.FirstName} {course.Instructor.LastName}",
                ProgramTitle = programTitle,
                EnrollmentStatus = status,
                ProgressPercent = progress.ProgressPercent,
                NextSessionAt = course.Sessions
                    .Where(s => s.StartTime > now)
                    .OrderBy(s => s.StartTime)
                    .Select(s => (DateTime?)s.StartTime)
                    .FirstOrDefault(),
                PendingAssignments = course.Assignments.Count(a => !a.Submissions.Any())
            };
        }

        // Course (with Category, Instructor) → learning page header
        public static LearnerCourseDetailDto ToLearnerCourseDetailDto(
            this Course course, EnrollmentStatus status, string? programTitle,
            LearnerProgressDto progress)
        {
            return new LearnerCourseDetailDto
            {
                Id = course.Id,
                Title = course.Title,
                ShortDescription = course.ShortDescription,
                FullDescription = course.FullDescription,
                Objectives = course.Objectives,
                ImageUrl = course.ImageUrl,
                CategoryName = course.Category.Name,
                Status = course.Status,
                DurationHours = course.DurationHours,
                StartDate = course.StartDate,
                EndDate = course.EndDate,
                Schedule = course.Schedule,
                Location = course.Location,
                Instructor = course.Instructor?.ToLearnerInstructorDto(),
                ProgramTitle = programTitle,
                EnrollmentStatus = status,
                CanSubmit = status == EnrollmentStatus.Active,
                Progress = progress
            };
        }

        public static LearnerInstructorDto ToLearnerInstructorDto(this User instructor)
        {
            return new LearnerInstructorDto
            {
                Id = instructor.Id,
                FullName = $"{instructor.FirstName} {instructor.LastName}",
                Email = instructor.Email,
                Specialization = instructor.Specialization,
                Bio = instructor.Bio,
                PhotoUrl = instructor.PhotoUrl
            };
        }

        // Session (with MY attendance only) → row
        public static LearnerSessionDto ToLearnerSessionDto(this Session session, DateTime now)
        {
            return new LearnerSessionDto
            {
                Id = session.Id,
                CourseId = session.CourseId,
                Title = session.Title,
                Description = session.Description,
                StartTime = session.StartTime,
                EndTime = session.EndTime,
                Location = session.Location,
                IsPast = session.StartTime <= now,
                MyAttendance = session.Attendances
                    .Select(a => (AttendanceStatus?)a.Status)
                    .FirstOrDefault()
            };
        }

        // Assignment (with MY submission only) → row
        public static LearnerAssignmentDto ToLearnerAssignmentDto(this Assignment assignment, DateTime now)
        {
            return new LearnerAssignmentDto
            {
                Id = assignment.Id,
                CourseId = assignment.CourseId,
                Title = assignment.Title,
                Description = assignment.Description,
                DueDate = assignment.DueDate,
                MaxScore = assignment.MaxScore,
                IsPastDue = assignment.DueDate < now,
                MySubmission = assignment.Submissions.FirstOrDefault()?.ToMySubmissionDto(assignment.DueDate)
            };
        }

        public static MySubmissionDto ToMySubmissionDto(this Submission submission, DateTime dueDate)
        {
            return new MySubmissionDto
            {
                Id = submission.Id,
                Content = submission.Content,
                FileUrl = submission.FileUrl,
                SubmittedAt = submission.SubmittedAt,
                IsLate = submission.SubmittedAt > dueDate,
                Status = submission.Status,
                Score = submission.Score,
                Feedback = submission.Feedback,
                GradedAt = submission.GradedAt
            };
        }

        // Session → dashboard "next sessions" item (reuses Salma's UpcomingSessionDto)
        public static UpcomingSessionDto ToUpcomingDto(this Session session, string courseTitle)
        {
            return new UpcomingSessionDto
            {
                Id = session.Id,
                CourseId = session.CourseId,
                CourseTitle = courseTitle,
                Title = session.Title,
                StartTime = session.StartTime,
                EndTime = session.EndTime,
                Location = session.Location
            };
        }
    }
}