using Andalusia.Api.DTOs.Requests;
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
        public async Task<ActionResult<Dictionary<string, string>>> GetAll()
        {
            return Ok(await _siteSettingService.GetAllAsync());
        }

        [Authorize(Roles = Roles.AdminOrContentManager)]
        [HttpPut]
        public async Task<ActionResult<Dictionary<string, string>>> Update(SiteSettingsUpdateDto dto)
        {
            return Ok(await _siteSettingService.UpdateAsync(dto));
        }
    }
}
