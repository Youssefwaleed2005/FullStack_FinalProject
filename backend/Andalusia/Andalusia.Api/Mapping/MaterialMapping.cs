using Andalusia.Api.DTOs.Requests;
using Andalusia.Api.DTOs.Responses;
using Andalusia.Api.Models;

namespace Andalusia.Api.Mapping
{
    public static class MaterialMapping
    {
        public static MaterialResponseDto ToResponseDto(this Material material)
        {
            return new MaterialResponseDto
            {
                Id = material.Id,
                CourseId = material.CourseId,
                Title = material.Title,
                Description = material.Description,
                Type = material.Type,
                Url = material.Url,
                CreatedAt = material.CreatedAt
            };
        }

        public static Material ToEntity(this MaterialRequestDto dto, int courseId)
        {
            return new Material
            {
                CourseId = courseId,
                Title = dto.Title.Trim(),
                Description = dto.Description,
                Type = dto.Type,
                Url = dto.Url.Trim()
            };
        }

        public static void UpdateEntity(this MaterialRequestDto dto, Material material)
        {
            material.Title = dto.Title.Trim();
            material.Description = dto.Description;
            material.Type = dto.Type;
            material.Url = dto.Url.Trim();
        }
    }
}