using Andalusia.Api.DTOs.Requests;
using Andalusia.Api.DTOs.Responses;
using Microsoft.AspNetCore.OutputCaching;
using Andalusia.Api.Helpers;
using Andalusia.Api.Services.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Andalusia.Api.Controllers
{
    [ApiController]
    [Route("api/site-settings")]
    public class SiteSettingsController : ControllerBase
    {
        private readonly ISiteSettingService _siteSettingService;

        public SiteSettingsController(ISiteSettingService siteSettingService)
        {
            _siteSettingService = siteSettingService;
        }

        [HttpGet]
        [OutputCache(PolicyName = CacheTags.PublicContentPolicy)]
        public async Task<ActionResult<Dictionary<string, string>>> GetAll()
        {
            return Ok(await _siteSettingService.GetAllAsync());
        }

        [Authorize(Roles = Roles.AdminOrContentManager)]
        [HttpPut]
        public async Task<ActionResult<Dictionary<string, string>>> Update(
            SiteSettingsUpdateDto dto, [FromServices] IOutputCacheStore cache, CancellationToken ct)
        {
            var result = await _siteSettingService.UpdateAsync(dto, User.GetUserId());
            await cache.EvictByTagAsync(CacheTags.PublicContent, ct);
            return Ok(result);
        }

        // GET /api/site-settings/last-edit → who saved the site info last, and when
        [Authorize(Roles = Roles.AdminOrContentManager)]
        [HttpGet("last-edit")]
        public async Task<ActionResult<LastEditDto>> GetLastEdit()
        {
            return Ok(await _siteSettingService.GetLastEditAsync());
        }
    }
}
