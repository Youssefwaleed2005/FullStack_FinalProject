using Andalusia.Api.DTOs.Requests;
using Andalusia.Api.DTOs.Responses;
using Andalusia.Api.Helpers;
using Andalusia.Api.Services.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Andalusia.Api.Controllers
{
    [ApiController]
    [Route("api/learner")]
    [Authorize(Roles = Roles.Learner)]
    public class LearnerController : ControllerBase
    {
        private readonly ILearnerService _learnerService;

        public LearnerController(ILearnerService learnerService)
        {
            _learnerService = learnerService;
        }

        [HttpGet("dashboard")]
        public async Task<ActionResult<LearnerDashboardDto>> GetDashboard()
        {
            return Ok(await _learnerService.GetDashboardAsync(User.GetUserId()));
        }

        [HttpGet("courses")]
        public async Task<ActionResult<List<LearnerCourseDto>>> GetMyCourses()
        {
            return Ok(await _learnerService.GetMyCoursesAsync(User.GetUserId()));
        }

        [HttpGet("courses/{courseId:int}")]
        public async Task<ActionResult<LearnerCourseDetailDto>> GetCourse(int courseId)
        {
            return Ok(await _learnerService.GetCourseAsync(User.GetUserId(), courseId));
        }

        [HttpGet("courses/{courseId:int}/sessions")]
        public async Task<ActionResult<List<LearnerSessionDto>>> GetSessions(int courseId)
        {
            return Ok(await _learnerService.GetSessionsAsync(User.GetUserId(), courseId));
        }

        [HttpGet("courses/{courseId:int}/materials")]
        public async Task<ActionResult<List<LearnerMaterialDto>>> GetMaterials(int courseId)
        {
            return Ok(await _learnerService.GetMaterialsAsync(User.GetUserId(), courseId));
        }

        [HttpGet("courses/{courseId:int}/assignments")]
        public async Task<ActionResult<List<LearnerAssignmentDto>>> GetAssignments(int courseId)
        {
            return Ok(await _learnerService.GetAssignmentsAsync(User.GetUserId(), courseId));
        }

        // PUT /api/learner/assignments/5/submission  (create or update my submission)
        [HttpPut("assignments/{assignmentId:int}/submission")]
        public async Task<ActionResult<MySubmissionDto>> Submit(int assignmentId, SubmitAssignmentRequestDto dto)
        {
            return Ok(await _learnerService.SubmitAsync(User.GetUserId(), assignmentId, dto));
        }

        // PUT /api/learner/materials/5/completion   { "completed": true }
        [HttpPut("materials/{materialId:int}/completion")]
        public async Task<ActionResult<MaterialCompletionResultDto>> SetMaterialCompletion(
            int materialId, MaterialCompletionRequestDto dto)
        {
            return Ok(await _learnerService.SetMaterialCompletionAsync(User.GetUserId(), materialId, dto.Completed));
        }
    }
}
