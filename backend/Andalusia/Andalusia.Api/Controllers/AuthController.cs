using Andalusia.Api.DTOs.Requests;
using Andalusia.Api.DTOs.Responses;
using Andalusia.Api.Helpers;
using Andalusia.Api.Services.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.RateLimiting;

namespace Andalusia.Api.Controllers
{
    [ApiController]
    [Route("api/auth")]
    public class AuthController : ControllerBase
    {
        private readonly IAuthService _authService;

        public AuthController(IAuthService authService)
        {
            _authService = authService;
        }

        [EnableRateLimiting(RateLimitPolicies.Auth)]
        [HttpPost("register")]
        public async Task<ActionResult<AuthResponseDto>> Register(RegisterRequestDto dto)
        {
            var result = await _authService.RegisterAsync(dto);
            return Ok(result);
        }

        [EnableRateLimiting(RateLimitPolicies.Auth)]
        [HttpPost("login")]
        public async Task<ActionResult<AuthResponseDto>> Login(LoginRequestDto dto)
        {
            var result = await _authService.LoginAsync(dto);
            return Ok(result);
        }

        [Authorize]
        [HttpGet("me")]
        public async Task<ActionResult<UserProfileResponseDto>> GetMe()
        {
            var profile = await _authService.GetProfileAsync(User.GetUserId());
            return Ok(profile);
        }

        [Authorize]
        [HttpPut("me")]
        public async Task<ActionResult<UserProfileResponseDto>> UpdateMe(UpdateProfileRequestDto dto)
        {
            var profile = await _authService.UpdateProfileAsync(User.GetUserId(), dto);
            return Ok(profile);
        }

        // POST /api/auth/me/photo   (multipart/form-data: file)
        [Authorize]
        [HttpPost("me/photo")]
        [Consumes("multipart/form-data")]
        [RequestSizeLimit(3 * 1024 * 1024)]
        public async Task<ActionResult<UserProfileResponseDto>> UploadPhoto([FromForm] UploadPhotoRequestDto dto)
        {
            return Ok(await _authService.UploadPhotoAsync(User.GetUserId(), dto.File));
        }

        // PUT /api/auth/change-password
        [Authorize]
        [EnableRateLimiting(RateLimitPolicies.Auth)]
        [HttpPut("change-password")]
        public async Task<IActionResult> ChangePassword(ChangePasswordRequestDto dto)
        {
            await _authService.ChangePasswordAsync(User.GetUserId(), dto);
            return NoContent();
        }

        // POST /api/auth/forgot-password   { "email": "..." }
        // resetUrl = the frontend's reset page, so the link opens the right site (MUI or shadcn)
        [EnableRateLimiting(RateLimitPolicies.Auth)]
        [HttpPost("forgot-password")]
        public async Task<ActionResult<ForgotPasswordResponseDto>> ForgotPassword(
            ForgotPasswordRequestDto dto, [FromQuery] string? resetUrl)
        {
            var page = Uri.TryCreate(resetUrl, UriKind.Absolute, out var uri) && (uri.Scheme == "http" || uri.Scheme == "https")
                ? uri.GetLeftPart(UriPartial.Path)
                : "http://localhost:5173/reset-password";
            return Ok(await _authService.ForgotPasswordAsync(dto, page));
        }

        // POST /api/auth/reset-password
        [EnableRateLimiting(RateLimitPolicies.Auth)]
        [HttpPost("reset-password")]
        public async Task<IActionResult> ResetPassword(ResetPasswordRequestDto dto)
        {
            await _authService.ResetPasswordAsync(dto);
            return NoContent();
        }
    }
}