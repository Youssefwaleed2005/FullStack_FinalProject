using Andalusia.Api.DTOs.Requests;
using Andalusia.Api.DTOs.Responses;
using Andalusia.Api.Exceptions;
using Andalusia.Api.Mapping;
using Andalusia.Api.Repos.Interfaces;
using Andalusia.Api.Services.Interfaces;

namespace Andalusia.Api.Services
{
    public class CategoryService : ICategoryService
    {
        private readonly ICategoryRepository _categoryRepository;

        public CategoryService(ICategoryRepository categoryRepository)
        {
            _categoryRepository = categoryRepository;
        }

        public async Task<IEnumerable<CategoryResponseDto>> GetAllAsync()
        {
            var categories = await _categoryRepository.GetAllAsync();

            return categories
                .OrderBy(c => c.Name)
                .Select(c => c.ToResponseDto());
        }

        public async Task<CategoryResponseDto> GetByIdAsync(int id)
        {
            var category = await _categoryRepository.GetByIdAsync(id);

            if (category == null)
                throw new NotFoundException($"Category with id {id} was not found.");

            return category.ToResponseDto();
        }

        public async Task<CategoryResponseDto> CreateAsync(CategoryRequestDto dto)
        {
            if (await _categoryRepository.NameExistsAsync(dto.Name))
                throw new ConflictException($"A category named '{dto.Name.Trim()}' already exists.");

            var category = dto.ToEntity();

            await _categoryRepository.AddAsync(category);
            await _categoryRepository.SaveChangesAsync();

            return category.ToResponseDto();
        }

        public async Task<CategoryResponseDto> UpdateAsync(int id, CategoryRequestDto dto)
        {
            var category = await _categoryRepository.GetByIdAsync(id);

            if (category == null)
                throw new NotFoundException($"Category with id {id} was not found.");

            if (await _categoryRepository.NameExistsAsync(dto.Name, excludeId: id))
                throw new ConflictException($"A category named '{dto.Name.Trim()}' already exists.");

            dto.UpdateEntity(category);

            _categoryRepository.Update(category);
            await _categoryRepository.SaveChangesAsync();

            return category.ToResponseDto();
        }

        public async Task DeleteAsync(int id)
        {
            var category = await _categoryRepository.GetByIdAsync(id);

            if (category == null)
                throw new NotFoundException($"Category with id {id} was not found.");

            if (await _categoryRepository.HasCoursesOrProgramsAsync(id))
                throw new ConflictException("This category cannot be deleted because it still has courses or programs.");

            _categoryRepository.Delete(category);
            await _categoryRepository.SaveChangesAsync();
        }
    }
}