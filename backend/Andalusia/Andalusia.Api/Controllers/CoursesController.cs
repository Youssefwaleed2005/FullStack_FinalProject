using Andalusia.Api.DTOs.Requests;
using Andalusia.Api.DTOs.Responses;
using Andalusia.Api.Services.Interfaces;
using Microsoft.AspNetCore.Mvc;

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

       
        [HttpPost]
        public async Task<ActionResult<CourseDetailsResponseDto>> Create(CourseRequestDto dto)
        {
            var created = await _courseService.CreateAsync(dto);
            return CreatedAtAction(nameof(GetById), new { id = created.Id }, created);
        }

       
        [HttpPut("{id:int}")]
        public async Task<ActionResult<CourseDetailsResponseDto>> Update(int id, CourseRequestDto dto)
        {
            var updated = await _courseService.UpdateAsync(id, dto);
            return Ok(updated);
        }

       
        [HttpDelete("{id:int}")]
        public async Task<IActionResult> Delete(int id)
        {
            await _courseService.DeleteAsync(id);
            return NoContent();
        }
    }
}