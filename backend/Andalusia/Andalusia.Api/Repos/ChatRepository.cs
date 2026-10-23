using Andalusia.Api.Data;
using Andalusia.Api.Enums;
using Andalusia.Api.Models;
using Andalusia.Api.Repos.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace Andalusia.Api.Repos
{
    public class ChatRepository : IChatRepository
    {
        private readonly AppDbContext _context;

        public ChatRepository(AppDbContext context)
        {
            _context = context;
        }

        // Drafts are hidden from the public, so the chatbot never mentions them
        public async Task<List<Course>> GetPublicCoursesAsync()
        {
            return await _context.Courses
                .AsNoTracking()
                .Include(c => c.Category)
                .Include(c => c.Instructor)
                .Where(c => c.Status != CatalogStatus.Draft)
                .OrderBy(c => c.Title)
                .ToListAsync();
        }

        public async Task<List<AcademyProgram>> GetPublicProgramsAsync()
        {
            return await _context.Programs
                .AsNoTracking()
                .Include(p => p.Category)
                .Include(p => p.ProgramCourses).ThenInclude(pc => pc.Course)
                .Where(p => p.Status != CatalogStatus.Draft)
                .OrderBy(p => p.Title)
                .ToListAsync();
        }

        public async Task<List<CareerPath>> GetPublishedCareerPathsAsync()
        {
            return await _context.CareerPaths
                .AsNoTracking()
                .Include(cp => cp.CareerPathPrograms).ThenInclude(cpp => cpp.Program)
                .Where(cp => cp.IsPublished)
                .OrderBy(cp => cp.Title)
                .ToListAsync();
        }
    }
}
