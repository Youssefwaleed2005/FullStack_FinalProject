using Andalusia.Api.Models;

namespace Andalusia.Api.Repos.Interfaces
{
    public interface IMaterialRepository : IGenericRepository<Material>
    {
        Task<List<Material>> GetByCourseAsync(int courseId);
        Task RemoveCompletionsAsync(int materialId);
    }
}