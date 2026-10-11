using Andalusia.Api.DTOs.Requests;
using Andalusia.Api.DTOs.Responses;
using Andalusia.Api.Helpers;
using Andalusia.Api.Services.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Andalusia.Api.Controllers
{
    [ApiController]
    [Route("api/applications")]
    [Authorize]
    public class ApplicationsController : ControllerBase
    {
        private readonly IApplicationService _applicationService;

        public ApplicationsController(IApplicationService applicationService)
        {
            _applicationService = applicationService;
        }

      
        [HttpPost]
        [Authorize(Roles = "Learner")]
        public async Task<ActionResult<ApplicationResponseDto>> Create(CreateApplicationRequestDto dto)
        {
            var created = await _applicationService.CreateAsync(User.GetUserId(), dto);
            return StatusCode(StatusCodes.Status201Created, created);
        }

        
        [HttpGet("me")]
        public async Task<ActionResult<IEnumerable<ApplicationResponseDto>>> GetMine()
        {
            var applications = await _applicationService.GetMyApplicationsAsync(User.GetUserId());
            return Ok(applications);
        }
    }
}