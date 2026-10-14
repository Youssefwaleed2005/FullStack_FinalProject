using Andalusia.Api.DTOs.Responses;
using Andalusia.Api.Helpers;
using Andalusia.Api.Services.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Andalusia.Api.Controllers
{
    [ApiController]
    [Route("api/enrollments")]
    [Authorize(Roles = "Learner")]
    public class EnrollmentsController : ControllerBase
    {
        private readonly IEnrollmentService _enrollmentService;

        public EnrollmentsController(IEnrollmentService enrollmentService)
        {
            _enrollmentService = enrollmentService;
        }

        
        [HttpGet("me")]
        public async Task<ActionResult<IEnumerable<EnrollmentResponseDto>>> GetMine()
        {
            var enrollments = await _enrollmentService.GetMyEnrollmentsAsync(User.GetUserId());
            return Ok(enrollments);
        }
    }
}