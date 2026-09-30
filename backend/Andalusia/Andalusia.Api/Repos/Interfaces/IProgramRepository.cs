using Andalusia.Api.DTOs.Requests;
using Andalusia.Api.Models;

namespace Andalusia.Api.Repos.Interfaces
{
    public interface IProgramRepository : IGenericRepository<AcademyProgram>
    {
        Task<(IEnumerable<AcademyProgram> Items, int TotalCount)> GetPagedAsync(ProgramQueryParameters query);
        Task<AcademyProgram?> GetByIdWithDetailsAsync(int id);
        Task<bool> HasApplicationsOrCareerPathsAsync(int programId);
        Task<bool> CategoryExistsAsync(int categoryId);
        Task<List<int>> GetExistingCourseIdsAsync(List<int> courseIds);
        Task ReplaceProgramCoursesAsync(int programId, List<int> courseIds);
    }
}