using Andalusia.Api.DTOs.Requests;
using Andalusia.Api.DTOs.Responses;

namespace Andalusia.Api.Services.Interfaces
{
    public interface ISiteSettingService
    {
        Task<Dictionary<string, string>> GetAllAsync();
        Task<Dictionary<string, string>> UpdateAsync(SiteSettingsUpdateDto dto, int actorId);
        Task<LastEditDto> GetLastEditAsync();
    }
}
