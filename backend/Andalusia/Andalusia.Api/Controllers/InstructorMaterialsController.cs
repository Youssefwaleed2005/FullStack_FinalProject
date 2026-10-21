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
    public class InstructorMaterialsController : ControllerBase
    {
        private readonly IMaterialService _materialService;

        public InstructorMaterialsController(IMaterialService materialService)
        {
            _materialService = materialService;
        }

        [HttpGet("courses/{courseId:int}/materials")]
        public async Task<ActionResult<List<MaterialResponseDto>>> GetByCourse(int courseId)
        {
            return Ok(await _materialService.GetByCourseAsync(User.GetUserId(), courseId));
        }

        [HttpPost("courses/{courseId:int}/materials")]
        public async Task<ActionResult<MaterialResponseDto>> Create(int courseId, MaterialRequestDto dto)
        {
            var created = await _materialService.CreateAsync(User.GetUserId(), courseId, dto);
            return StatusCode(StatusCodes.Status201Created, created);
        }

        [HttpPut("materials/{id:int}")]
        public async Task<ActionResult<MaterialResponseDto>> Update(int id, MaterialRequestDto dto)
        {
            return Ok(await _materialService.UpdateAsync(User.GetUserId(), id, dto));
        }

        [HttpDelete("materials/{id:int}")]
        public async Task<IActionResult> Delete(int id)
        {
            await _materialService.DeleteAsync(User.GetUserId(), id);
            return NoContent();
        }

        // POST /api/instructor/courses/5/materials/upload   (multipart/form-data: file, title, description)
        [HttpPost("courses/{courseId:int}/materials/upload")]
        [Consumes("multipart/form-data")]
        [RequestSizeLimit(30 * 1024 * 1024)]
        public async Task<ActionResult<MaterialResponseDto>> Upload(int courseId, [FromForm] UploadMaterialRequestDto dto)
        {
            var created = await _materialService.UploadAsync(User.GetUserId(), courseId, dto);
            return StatusCode(StatusCodes.Status201Created, created);
        }
    }
}
