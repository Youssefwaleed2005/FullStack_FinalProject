using Andalusia.Api.Models;

namespace Andalusia.Api.Repos.Interfaces
{
    public interface ICareerPathRepository : IGenericRepository<CareerPath>
    {
        Task<IEnumerable<CareerPath>> GetPublishedAsync(bool? isFeatured, int? take);
        Task<CareerPath?> GetByIdWithDetailsAsync(int id);
        Task<CareerPath?> GetByIdWithLinksAsync(int id);
        Task<bool> AllProgramsExistAsync(IEnumerable<int> programIds);
        void RemoveLinks(IEnumerable<CareerPathProgram> links);
    }
}