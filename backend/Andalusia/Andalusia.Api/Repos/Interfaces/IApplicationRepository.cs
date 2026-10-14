using Andalusia.Api.Models;

namespace Andalusia.Api.Repos.Interfaces
{
    public interface IApplicationRepository : IGenericRepository<Application>
    {
        Task<IEnumerable<Application>> GetByUserAsync(int userId);
        Task<Application?> GetByIdWithTargetAsync(int id);
        Task<bool> HasActiveApplicationAsync(int userId, int? courseId, int? programId);
    }
}