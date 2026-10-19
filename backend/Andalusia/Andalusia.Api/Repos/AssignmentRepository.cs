using Andalusia.Api.Data;
using Andalusia.Api.Models;
using Andalusia.Api.Repos.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace Andalusia.Api.Repos
{
    public class AssignmentRepository : GenericRepository<Assignment>, IAssignmentRepository
    {
        public AssignmentRepository(AppDbContext context) : base(context) { }

        // Course assignments, soonest due first
        public async Task<List<Assignment>> GetByCourseAsync(int courseId)
        {
            return await _dbSet
                .AsNoTracking()
                .Include(a => a.Submissions)
                .Where(a => a.CourseId == courseId)
                .OrderBy(a => a.DueDate)
                .ToListAsync();
        }

        // Tracked: used for edit / delete
        public async Task<Assignment?> GetByIdWithSubmissionsAsync(int id)
        {
            return await _dbSet
                .Include(a => a.Submissions)
                .FirstOrDefaultAsync(a => a.Id == id);
        }

        public async Task<List<Submission>> GetSubmissionsAsync(int assignmentId)
        {
            return await _context.Submissions
                .AsNoTracking()
                .Include(s => s.User)
                .Include(s => s.Assignment)
                .Where(s => s.AssignmentId == assignmentId)
                .OrderBy(s => s.SubmittedAt)
                .ToListAsync();
        }

        // Tracked: used for grading
        public async Task<Submission?> GetSubmissionForGradingAsync(int submissionId)
        {
            return await _context.Submissions
                .Include(s => s.User)
                .Include(s => s.Assignment)
                .FirstOrDefaultAsync(s => s.Id == submissionId);
        }
    }
}