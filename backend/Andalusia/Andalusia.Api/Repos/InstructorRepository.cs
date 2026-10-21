using Andalusia.Api.Data;
using Andalusia.Api.Enums;
using Andalusia.Api.Models;
using Andalusia.Api.Repos.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace Andalusia.Api.Repos
{
    public class InstructorRepository : IInstructorRepository
    {
        private readonly AppDbContext _context;

        public InstructorRepository(AppDbContext context)
        {
            _context = context;
        }

        // Used by the ownership check
        public async Task<Course?> GetCourseAsync(int courseId)
        {
            return await _context.Courses
                .AsNoTracking()
                .FirstOrDefaultAsync(c => c.Id == courseId);
        }

        // My courses + their sessions, assignments and submissions (for the counts)
        public async Task<List<Course>> GetCoursesWithActivityAsync(int instructorId)
        {
            return await _context.Courses
                .AsNoTracking()
                .Include(c => c.Sessions)
                .Include(c => c.Assignments).ThenInclude(a => a.Submissions)
                .Where(c => c.InstructorId == instructorId)
                .OrderBy(c => c.StartDate)
                .ToListAsync();
        }

        // Learners actively enrolled in this course (directly, or through a program that includes it)
        public async Task<List<int>> GetActiveStudentIdsAsync(int courseId)
        {
            return await _context.Enrollments
                .Where(e => e.Status == EnrollmentStatus.Active)
                .Where(e => e.Application.CourseId == courseId
                         || (e.Application.Program != null
                             && e.Application.Program.ProgramCourses.Any(pc => pc.CourseId == courseId)))
                .Select(e => e.Application.UserId)
                .Distinct()
                .ToListAsync();
        }

        // Active enrollments for this course, with the learner
        public async Task<List<Enrollment>> GetActiveEnrollmentsAsync(int courseId)
        {
            return await _context.Enrollments
                .AsNoTracking()
                .Include(e => e.Application).ThenInclude(a => a.User)
                .Where(e => e.Status == EnrollmentStatus.Active)
                .Where(e => e.Application.CourseId == courseId
                         || (e.Application.Program != null
                             && e.Application.Program.ProgramCourses.Any(pc => pc.CourseId == courseId)))
                .OrderBy(e => e.Application.User.FirstName)
                .ToListAsync();
        }

        // One course with sessions (+ attendance) and assignments (+ submissions)
        public async Task<Course?> GetCourseWithActivityAsync(int courseId)
        {
            return await _context.Courses
                .AsNoTracking()
                .AsSplitQuery()
                .Include(c => c.Sessions).ThenInclude(s => s.Attendances)
                .Include(c => c.Assignments).ThenInclude(a => a.Submissions)
                .Include(c => c.Materials).ThenInclude(m => m.Completions)
                .FirstOrDefaultAsync(c => c.Id == courseId);
        }
    }
}
