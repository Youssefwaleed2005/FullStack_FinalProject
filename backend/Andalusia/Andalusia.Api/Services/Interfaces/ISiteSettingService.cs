using Andalusia.Api.DTOs.Requests;

namespace Andalusia.Api.Services.Interfaces
{
    public interface ISiteSettingService
    {
        Task<Dictionary<string, string>> GetAllAsync();
        Task<Dictionary<string, string>> UpdateAsync(SiteSettingsUpdateDto dto);
    }
}
