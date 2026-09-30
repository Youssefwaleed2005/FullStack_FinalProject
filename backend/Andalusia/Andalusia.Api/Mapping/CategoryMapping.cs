using Andalusia.Api.DTOs.Requests;
using Andalusia.Api.DTOs.Responses;
using Andalusia.Api.Models;

namespace Andalusia.Api.Mapping
{
    public static class CategoryMapping
    {
        // Category  → CategoryResponseDto (sent to the website)
        public static CategoryResponseDto ToResponseDto(this Category category)
        {
            return new CategoryResponseDto
            {
                Id = category.Id,
                Name = category.Name,
                Description = category.Description,
                IconUrl = category.IconUrl,
                IsFeatured = category.IsFeatured
            };
        }

        // CategoryRequestDto (from the website) → new Category 
        public static Category ToEntity(this CategoryRequestDto dto)
        {
            return new Category
            {
                Name = dto.Name.Trim(),
                Description = dto.Description,
                IconUrl = dto.IconUrl,
                IsFeatured = dto.IsFeatured
            };
        }

        
        public static void UpdateEntity(this CategoryRequestDto dto, Category category)
        {
            category.Name = dto.Name.Trim();
            category.Description = dto.Description;
            category.IconUrl = dto.IconUrl;
            category.IsFeatured = dto.IsFeatured;
        }
    }
}