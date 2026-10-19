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
    public class InstructorAssignmentsController : ControllerBase
    {
        private readonly IAssignmentService _assignmentService;

        public InstructorAssignmentsController(IAssignmentService assignmentService)
        {
            _assignmentService = assignmentService;
        }

        [HttpGet("courses/{courseId:int}/assignments")]
        public async Task<ActionResult<List<AssignmentResponseDto>>> GetByCourse(int courseId)
        {
            return Ok(await _assignmentService.GetByCourseAsync(User.GetUserId(), courseId));
        }

        [HttpPost("courses/{courseId:int}/assignments")]
        public async Task<ActionResult<AssignmentResponseDto>> Create(int courseId, AssignmentRequestDto dto)
        {
            var created = await _assignmentService.CreateAsync(User.GetUserId(), courseId, dto);
            return StatusCode(StatusCodes.Status201Created, created);
        }

        [HttpPut("assignments/{id:int}")]
        public async Task<ActionResult<AssignmentResponseDto>> Update(int id, AssignmentRequestDto dto)
        {
            return Ok(await _assignmentService.UpdateAsync(User.GetUserId(), id, dto));
        }

        [HttpDelete("assignments/{id:int}")]
        public async Task<IActionResult> Delete(int id)
        {
            await _assignmentService.DeleteAsync(User.GetUserId(), id);
            return NoContent();
        }

        // GET /api/instructor/assignments/5/submissions
        [HttpGet("assignments/{id:int}/submissions")]
        public async Task<ActionResult<List<SubmissionResponseDto>>> GetSubmissions(int id)
        {
            return Ok(await _assignmentService.GetSubmissionsAsync(User.GetUserId(), id));
        }

        // PUT /api/instructor/submissions/5/grade
        [HttpPut("submissions/{id:int}/grade")]
        public async Task<ActionResult<SubmissionResponseDto>> Grade(int id, GradeSubmissionRequestDto dto)
        {
            return Ok(await _assignmentService.GradeAsync(User.GetUserId(), id, dto));
        }
    }
}