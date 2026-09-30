using Andalusia.Api.DTOs.Requests;
using Andalusia.Api.DTOs.Responses;
using Andalusia.Api.Services.Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace Andalusia.Api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class CareerPathsController : ControllerBase
    {
        private readonly ICareerPathService _careerPathService;

        public CareerPathsController(ICareerPathService careerPathService)
        {
            _careerPathService = careerPathService;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<CareerPathResponseDto>>> GetPublished(
            [FromQuery] bool? isFeatured, [FromQuery] int? take)
        {
            var paths = await _careerPathService.GetPublishedAsync(isFeatured, take);
            return Ok(paths);
        }

        [HttpGet("{id:int}")]
        public async Task<ActionResult<CareerPathDetailsResponseDto>> GetById(int id)
        {
            var path = await _careerPathService.GetByIdAsync(id);
            return Ok(path);
        }

        [HttpPost]
        public async Task<ActionResult<CareerPathDetailsResponseDto>> Create(CareerPathRequestDto dto)
        {
            var created = await _careerPathService.CreateAsync(dto);
            return CreatedAtAction(nameof(GetById), new { id = created.Id }, created);
        }

        [HttpPut("{id:int}")]
        public async Task<ActionResult<CareerPathDetailsResponseDto>> Update(int id, CareerPathRequestDto dto)
        {
            var updated = await _careerPathService.UpdateAsync(id, dto);
            return Ok(updated);
        }

        [HttpDelete("{id:int}")]
        public async Task<IActionResult> Delete(int id)
        {
            await _careerPathService.DeleteAsync(id);
            return NoContent();
        }
    }
}