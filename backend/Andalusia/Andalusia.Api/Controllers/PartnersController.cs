using Andalusia.Api.DTOs.Requests;
using Andalusia.Api.DTOs.Responses;
using Andalusia.Api.Enums;
using Andalusia.Api.Services.Interfaces;
using Microsoft.AspNetCore.Mvc;
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

        [Authorize(Roles = Roles.AdminOrContentManager)]
        [HttpGet("manage")]
        public async Task<ActionResult<IEnumerable<PartnerAdminResponseDto>>> GetAllForAdmin()
        {
            return Ok(await _partnerService.GetAllForAdminAsync());
        }
    }
}