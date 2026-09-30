using Andalusia.Api.Models;

namespace Andalusia.Api.Repos.Interfaces
{
    public interface ICategoryRepository : IGenericRepository<Category>
    {
        Task<bool> NameExistsAsync(string name, int? excludeId = null);
        Task<bool> HasCoursesOrProgramsAsync(int categoryId);
    }
}