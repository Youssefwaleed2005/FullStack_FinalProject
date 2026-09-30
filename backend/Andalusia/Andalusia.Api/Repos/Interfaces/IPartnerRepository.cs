using Andalusia.Api.Enums;
using Andalusia.Api.Models;

namespace Andalusia.Api.Repos.Interfaces
{
    public interface IPartnerRepository : IGenericRepository<Partner>
    {
        Task<IEnumerable<Partner>> GetActiveAsync(PartnerType? type, int? take);
    }
}