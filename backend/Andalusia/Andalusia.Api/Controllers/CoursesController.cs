using Andalusia.Api.DTOs.Requests;
using Andalusia.Api.DTOs.Responses;
using Andalusia.Api.Services.Interfaces;
using Microsoft.AspNetCore.Mvc;
using Andalusia.Api.Helpers;
using Microsoft.AspNetCore.Authorization;

namespace Andalusia.Api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class CoursesController : ControllerBase
    {
        private readonly ICourseService _courseService;

        public CoursesController(ICourseService courseService)
        {
            _courseService = courseService;
        }

        
        [HttpGet]
        public async Task<ActionResult<PagedResponse<CourseResponseDto>>> GetAll([FromQuery] CourseQueryParameters query)
        {
            var result = await _courseService.GetAllAsync(query);
            return Ok(result);
        }

        
        [HttpGet("{id:int}")]
        public async Task<ActionResult<CourseDetailsResponseDto>> GetById(int id)
        {
            var course = await _courseService.GetByIdAsync(id);
            return Ok(course);
        }

       
        [Authorize(Roles = Roles.Admin)]
        [HttpPost]
        public async Task<ActionResult<CourseDetailsResponseDto>> Create(CourseRequestDto dto)
        {
            var created = await _courseService.CreateAsync(dto, User.GetUserId());
            return CreatedAtAction(nameof(GetById), new { id = created.Id }, created);
        }

       
        [Authorize(Roles = Roles.Admin)]
        [HttpPut("{id:int}")]
        public async Task<ActionResult<CourseDetailsResponseDto>> Update(int id, CourseRequestDto dto)
        {
            var updated = await _courseService.UpdateAsync(id, dto, User.GetUserId());
            return Ok(updated);
        }

       
        [Authorize(Roles = Roles.Admin)]
        [HttpDelete("{id:int}")]
        public async Task<IActionResult> Delete(int id)
        {
            // 200 + { archived: true } when the course had history and was archived instead
            var archived = await _courseService.DeleteAsync(id, User.GetUserId());
            if (archived) return Ok(new { archived = true });
            return NoContent();
        }

        // PUT /api/courses/5/restore → brings an archived course back
        [Authorize(Roles = Roles.Admin)]
        [HttpPut("{id:int}/restore")]
        public async Task<IActionResult> Restore(int id)
        {
            await _courseService.RestoreAsync(id, User.GetUserId());
            return NoContent();
        }
   
        // GET /api/courses/5/reviews → average, star breakdown and the reviews (public)
        [HttpGet("{id:int}/reviews")]
        public async Task<ActionResult<CourseReviewsDto>> GetReviews(int id)
        {
            return Ok(await _courseService.GetReviewsAsync(id));
        }

        // GET /api/courses/5/schedule → the planned sessions (course outline), public
        [HttpGet("{id:int}/schedule")]
        public async Task<ActionResult<List<CourseScheduleItemDto>>> GetSchedule(int id)
        {
            return Ok(await _courseService.GetScheduleAsync(id));
        }

        [HttpGet("{id:int}/related")]
        public async Task<ActionResult<IEnumerable<CourseResponseDto>>> GetRelated(int id, [FromQuery] int take = 4)
        {
            var related = await _courseService.GetRelatedAsync(id, take);
            return Ok(related);
        }
    }
}