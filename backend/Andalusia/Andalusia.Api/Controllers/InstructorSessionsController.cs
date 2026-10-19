using Andalusia.Api.DTOs.Requests;
using Andalusia.Api.DTOs.Responses;
using Andalusia.Api.Helpers;
using Andalusia.Api.Services.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Andalusia.Api.Controllers
{
    [ApiController]
    [Route("api/instructor")]
    [Authorize(Roles = Roles.Instructor)]
    public class InstructorSessionsController : ControllerBase
    {
        private readonly ISessionService _sessionService;
        private readonly IAttendanceService _attendanceService;

        public InstructorSessionsController(ISessionService sessionService, IAttendanceService attendanceService)
        {
            _sessionService = sessionService;
            _attendanceService = attendanceService;
        }

        [HttpGet("courses/{courseId:int}/sessions")]
        public async Task<ActionResult<List<SessionResponseDto>>> GetByCourse(int courseId)
        {
            return Ok(await _sessionService.GetByCourseAsync(User.GetUserId(), courseId));
        }

        [HttpPost("courses/{courseId:int}/sessions")]
        public async Task<ActionResult<SessionResponseDto>> Create(int courseId, SessionRequestDto dto)
        {
            var created = await _sessionService.CreateAsync(User.GetUserId(), courseId, dto);
            return StatusCode(StatusCodes.Status201Created, created);
        }

        [HttpPut("sessions/{id:int}")]
        public async Task<ActionResult<SessionResponseDto>> Update(int id, SessionRequestDto dto)
        {
            return Ok(await _sessionService.UpdateAsync(User.GetUserId(), id, dto));
        }

        [HttpDelete("sessions/{id:int}")]
        public async Task<IActionResult> Delete(int id)
        {
            await _sessionService.DeleteAsync(User.GetUserId(), id);
            return NoContent();
        }

        // GET /api/instructor/sessions/5/attendance
        [HttpGet("sessions/{sessionId:int}/attendance")]
        public async Task<ActionResult<SessionAttendanceDto>> GetAttendance(int sessionId)
        {
            return Ok(await _attendanceService.GetSessionAttendanceAsync(User.GetUserId(), sessionId));
        }

        // PUT /api/instructor/sessions/5/attendance
        [HttpPut("sessions/{sessionId:int}/attendance")]
        public async Task<ActionResult<SessionAttendanceDto>> MarkAttendance(int sessionId, MarkAttendanceRequestDto dto)
        {
            return Ok(await _attendanceService.MarkAttendanceAsync(User.GetUserId(), sessionId, dto));
        }
    }
}