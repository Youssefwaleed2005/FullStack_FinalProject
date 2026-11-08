using Andalusia.Api.DTOs.Requests;
using Andalusia.Api.DTOs.Responses;
using Andalusia.Api.Enums;
using Andalusia.Api.Services.Interfaces;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.OutputCaching;
using Andalusia.Api.Helpers;
using Microsoft.AspNetCore.Authorization;

namespace Andalusia.Api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class PartnersController : ControllerBase
    {
        private readonly IPartnerService _partnerService;

        public PartnersController(IPartnerService partnerService)
        {
            _partnerService = partnerService;
        }

        [OutputCache(PolicyName = CacheTags.PublicContentPolicy)]
        [HttpGet]
        public async Task<ActionResult<IEnumerable<PartnerResponseDto>>> GetActive(
            [FromQuery] PartnerType? type, [FromQuery] int? take)
        {
            var partners = await _partnerService.GetActiveAsync(type, take);
            return Ok(partners);
        }

        [HttpGet("{id:int}")]
        public async Task<ActionResult<PartnerResponseDto>> GetById(int id)
        {
            var partner = await _partnerService.GetByIdAsync(id);
            return Ok(partner);
        }

        [Authorize(Roles = Roles.AdminOrContentManager)]
        [HttpPost]
        public async Task<ActionResult<PartnerResponseDto>> Create(PartnerRequestDto dto)
        {
            var created = await _partnerService.CreateAsync(dto);
            return CreatedAtAction(nameof(GetById), new { id = created.Id }, created);
        }

        [Authorize(Roles = Roles.AdminOrContentManager)]
        [HttpPut("{id:int}")]
        public async Task<ActionResult<PartnerResponseDto>> Update(int id, PartnerRequestDto dto)
        {
            var updated = await _partnerService.UpdateAsync(id, dto);
            return Ok(updated);
        }

        [Authorize(Roles = Roles.AdminOrContentManager)]
        [HttpDelete("{id:int}")]
        public async Task<IActionResult> Delete(int id)
        {
            await _partnerService.DeleteAsync(id);
            return NoContent();
        }

        // POST /api/partners/logo   (multipart/form-data: file) → { "url": "/uploads/partners/....png" }
        // The admin uploads the image first, then saves the partner with that url as its LogoUrl.
        [Authorize(Roles = Roles.AdminOrContentManager)]
        [HttpPost("logo")]
        [Consumes("multipart/form-data")]
        [RequestSizeLimit(3 * 1024 * 1024)]
        public async Task<ActionResult<UploadedFileDto>> UploadLogo([FromForm] UploadPartnerLogoRequestDto dto)
        {
            return Ok(await _partnerService.UploadLogoAsync(dto.File));
        }

        [Authorize(Roles = Roles.AdminOrContentManager)]
        [HttpGet("manage")]
        public async Task<ActionResult<IEnumerable<PartnerAdminResponseDto>>> GetAllForAdmin()
        {
            return Ok(await _partnerService.GetAllForAdminAsync());
        }
    }
}