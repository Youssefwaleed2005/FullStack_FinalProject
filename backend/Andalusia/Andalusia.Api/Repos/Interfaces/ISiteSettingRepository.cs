using Andalusia.Api.Models;

namespace Andalusia.Api.Repos.Interfaces
{
    public interface ISiteSettingRepository : IGenericRepository<SiteSetting>
    {
        Task<string?> GetUserFullNameAsync(int userId);
        Task<SiteSetting?> GetLastEditedAsync();
    }
}
