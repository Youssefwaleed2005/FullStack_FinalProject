using Andalusia.Api.Models;

namespace Andalusia.Api.Repos.Interfaces
{
    public interface IEnrollmentRepository : IGenericRepository<Enrollment>
    {
        Task<IEnumerable<Enrollment>> GetByUserAsync(int userId);
    }
}