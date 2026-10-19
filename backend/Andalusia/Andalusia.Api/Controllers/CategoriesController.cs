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
    public class CategoriesController : ControllerBase
    {
        private readonly ICategoryService _categoryService;

        public CategoriesController(ICategoryService categoryService)
        {
            _categoryService = categoryService;
        }

        
        [HttpGet]
        public async Task<ActionResult<IEnumerable<CategoryResponseDto>>> GetAll()
        {
            var categories = await _categoryService.GetAllAsync();
            return Ok(categories);
        }

      
        [HttpGet("{id:int}")]
        public async Task<ActionResult<CategoryResponseDto>> GetById(int id)
        {
            var category = await _categoryService.GetByIdAsync(id);
            return Ok(category);
        }

      
        [Authorize(Roles = Roles.Admin)]
        [HttpPost]
        public async Task<ActionResult<CategoryResponseDto>> Create(CategoryRequestDto dto)
        {
            var created = await _categoryService.CreateAsync(dto);
            return CreatedAtAction(nameof(GetById), new { id = created.Id }, created);
        }

      
        [Authorize(Roles = Roles.Admin)]
        [HttpPut("{id:int}")]
        public async Task<ActionResult<CategoryResponseDto>> Update(int id, CategoryRequestDto dto)
        {
            var updated = await _categoryService.UpdateAsync(id, dto);
            return Ok(updated);
        }

       
        [Authorize(Roles = Roles.Admin)]
        [HttpDelete("{id:int}")]
        public async Task<IActionResult> Delete(int id)
        {
            await _categoryService.DeleteAsync(id);
            return NoContent();
        }
    }
}