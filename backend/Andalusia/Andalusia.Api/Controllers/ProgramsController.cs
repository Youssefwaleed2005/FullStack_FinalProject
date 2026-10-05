using Andalusia.Api.DTOs.Requests;
using Andalusia.Api.DTOs.Responses;
using Andalusia.Api.Services.Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace Andalusia.Api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ProgramsController : ControllerBase
    {
        private readonly IProgramService _programService;

        public ProgramsController(IProgramService programService)
        {
            _programService = programService;
        }

       
        [HttpGet]
        public async Task<ActionResult<PagedResponse<ProgramResponseDto>>> GetAll([FromQuery] ProgramQueryParameters query)
        {
            var result = await _programService.GetAllAsync(query);
            return Ok(result);
        }

       
        [HttpGet("{id:int}")]
        public async Task<ActionResult<ProgramDetailsResponseDto>> GetById(int id)
        {
            var program = await _programService.GetByIdAsync(id);
            return Ok(program);
        }

      
        [HttpPost]
        public async Task<ActionResult<ProgramDetailsResponseDto>> Create(ProgramRequestDto dto)
        {
            var created = await _programService.CreateAsync(dto);
            return CreatedAtAction(nameof(GetById), new { id = created.Id }, created);
        }

        
        [HttpPut("{id:int}")]
        public async Task<ActionResult<ProgramDetailsResponseDto>> Update(int id, ProgramRequestDto dto)
        {
            var updated = await _programService.UpdateAsync(id, dto);
            return Ok(updated);
        }

        
        [HttpDelete("{id:int}")]
        public async Task<IActionResult> Delete(int id)
        {
            await _programService.DeleteAsync(id);
            return NoContent();
        }

        [HttpGet("{id:int}/related")]
        public async Task<ActionResult<IEnumerable<ProgramResponseDto>>> GetRelated(int id, [FromQuery] int take = 3)
        {
            var related = await _programService.GetRelatedAsync(id, take);
            return Ok(related);
        }
    }
}