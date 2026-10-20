using Andalusia.Api.Data;
using Andalusia.Api.Enums;
using Andalusia.Api.Models;
using Andalusia.Api.Repos.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace Andalusia.Api.Repos
{
    public class LearnerRepository : ILearnerRepository
    {
        private readonly AppDbContext _context;

        public LearnerRepository(AppDbContext context)
        {
            _context = context;
        }

        // Enrollments that give access to content (Active = full, Completed = read-only),
        // with the course, or the program and its courses


        public async Task<bool> CourseExistsAsync(int courseId)
        {
            return await _context.Courses.AnyAsync(c => c.Id == courseId);
        }

        public async Task<List<Enrollment>> GetMyEnrollmentsAsync(int userId)
        {
            return await _context.Enrollments
                .AsNoTracking()
                .Include(e => e.Application).ThenInclude(a => a.Course)
                .Include(e => e.Application).ThenInclude(a => a.Program)
                    .ThenInclude(p => p!.ProgramCourses)
                .Where(e => e.Application.UserId == userId)
                .Where(e => e.Status == EnrollmentStatus.Active || e.Status == EnrollmentStatus.Completed)
                .ToListAsync();
        }

        public async Task<List<Course>> GetCoursesWithMyActivityAsync(List<int> courseIds, int userId)
        {
            return await CoursesWithMyActivity(userId)
                .Where(c => courseIds.Contains(c.Id))
                .OrderBy(c => c.StartDate)
                .ToListAsync();
        }

        public async Task<Course?> GetCourseWithMyActivityAsync(int courseId, int userId)
        {
            return await CoursesWithMyActivity(userId)
                .FirstOrDefaultAsync(c => c.Id == courseId);
        }

        // Plain read: used to find the course + due date before submitting
        public async Task<Assignment?> GetAssignmentAsync(int assignmentId)
        {
            return await _context.Assignments
                .AsNoTracking()
                .FirstOrDefaultAsync(a => a.Id == assignmentId);
        }

        // Tracked: used to update an existing submission
        public async Task<Submission?> GetMySubmissionAsync(int assignmentId, int userId)
        {
            return await _context.Submissions
                .FirstOrDefaultAsync(s => s.AssignmentId == assignmentId && s.UserId == userId);
        }

        public async Task AddSubmissionAsync(Submission submission)
        {
            await _context.Submissions.AddAsync(submission);
        }

        public async Task SaveChangesAsync()
        {
            await _context.SaveChangesAsync();
        }

        // Course + category + instructor + sessions/assignments,
        // but ONLY this learner's attendance and submissions (filtered includes)
        private IQueryable<Course> CoursesWithMyActivity(int userId)
        {
            return _context.Courses
                .AsNoTracking()
                .AsSplitQuery()
                .Include(c => c.Category)
                .Include(c => c.Instructor)
                .Include(c => c.Sessions)
                    .ThenInclude(s => s.Attendances.Where(a => a.UserId == userId))
                .Include(c => c.Assignments)
                    .ThenInclude(a => a.Submissions.Where(s => s.UserId == userId));
        }
    }
}