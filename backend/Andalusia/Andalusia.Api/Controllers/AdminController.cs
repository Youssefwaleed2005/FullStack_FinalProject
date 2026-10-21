using Andalusia.Api.DTOs.Requests;
using Andalusia.Api.DTOs.Responses;
using Andalusia.Api.Enums;
using Andalusia.Api.Helpers;
using Andalusia.Api.Services.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Andalusia.Api.Controllers
{
    [ApiController]
    [Route("api/admin")]
    [Authorize(Roles = Roles.Admin)]
    public class AdminController : ControllerBase
    {
        private readonly IAdminService _adminService;

        public AdminController(IAdminService adminService)
        {
            _adminService = adminService;
        }

        // GET /api/admin/dashboard
        [HttpGet("dashboard")]
        public async Task<ActionResult<AdminDashboardDto>> GetDashboard()
        {
            return Ok(await _adminService.GetDashboardAsync());
        }

        // GET /api/admin/payments?status=Paid&search=omar
        [HttpGet("payments")]
        public async Task<ActionResult<List<AdminPaymentDto>>> GetPayments(
            [FromQuery] PaymentStatus? status, [FromQuery] string? search)
        {
            return Ok(await _adminService.GetPaymentsAsync(status, search));
        }

        // GET /api/admin/users?role=Instructor&search=ahmed&isActive=true
        [HttpGet("users")]
        public async Task<ActionResult<List<AdminUserDto>>> GetUsers(
            [FromQuery] string? role, [FromQuery] string? search, [FromQuery] bool? isActive)
        {
            return Ok(await _adminService.GetUsersAsync(role, search, isActive));
        }

        // GET /api/admin/users/5
        [HttpGet("users/{id:int}")]
        public async Task<ActionResult<AdminUserDto>> GetUser(int id)
        {
            return Ok(await _adminService.GetUserAsync(id));
        }

        // PUT /api/admin/users/5/status   { "isActive": false }
        [HttpPut("users/{id:int}/status")]
        public async Task<ActionResult<AdminUserDto>> SetUserStatus(int id, UpdateUserStatusRequestDto dto)
        {
            return Ok(await _adminService.SetUserStatusAsync(User.GetUserId(), id, dto.IsActive));
        }

        // POST /api/admin/instructors
        [HttpPost("instructors")]
        public async Task<ActionResult<AdminUserDto>> CreateInstructor(CreateInstructorRequestDto dto)
        {
            var created = await _adminService.CreateInstructorAsync(dto);
            return StatusCode(StatusCodes.Status201Created, created);
        }

        // PUT /api/admin/courses/5/instructor   { "instructorId": 2 }
        [HttpPut("courses/{courseId:int}/instructor")]
        public async Task<IActionResult> AssignInstructor(int courseId, AssignInstructorRequestDto dto)
        {
            await _adminService.AssignInstructorAsync(courseId, dto.InstructorId);
            return NoContent();
        }

        // GET /api/admin/courses   (all courses, drafts included)
        [HttpGet("courses")]
        public async Task<ActionResult<List<CourseResponseDto>>> GetCourses()
        {
            return Ok(await _adminService.GetAllCoursesAsync());
        }
    }
}
