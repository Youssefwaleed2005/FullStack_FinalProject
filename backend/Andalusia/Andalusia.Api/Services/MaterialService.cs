using Andalusia.Api.DTOs.Requests;
using Andalusia.Api.DTOs.Responses;
using Andalusia.Api.Exceptions;
using Andalusia.Api.Mapping;
using Andalusia.Api.Models;
using Andalusia.Api.Repos.Interfaces;
using Andalusia.Api.Services.Interfaces;

namespace Andalusia.Api.Services
{
    public class MaterialService : IMaterialService
    {
        private readonly IMaterialRepository _materialRepository;
        private readonly IInstructorService _instructorService;

        public MaterialService(IMaterialRepository materialRepository, IInstructorService instructorService)
        {
            _materialRepository = materialRepository;
            _instructorService = instructorService;
        }

        public async Task<List<MaterialResponseDto>> GetByCourseAsync(int instructorId, int courseId)
        {
            await _instructorService.EnsureOwnsCourseAsync(instructorId, courseId);

            var materials = await _materialRepository.GetByCourseAsync(courseId);
            return materials.Select(m => m.ToResponseDto()).ToList();
        }

        public async Task<MaterialResponseDto> CreateAsync(int instructorId, int courseId, MaterialRequestDto dto)
        {
            await _instructorService.EnsureOwnsCourseAsync(instructorId, courseId);

            var material = dto.ToEntity(courseId);
            await _materialRepository.AddAsync(material);
            await _materialRepository.SaveChangesAsync();

            return material.ToResponseDto();
        }

        public async Task<MaterialResponseDto> UpdateAsync(int instructorId, int materialId, MaterialRequestDto dto)
        {
            var material = await GetOwnedMaterialAsync(instructorId, materialId);

            dto.UpdateEntity(material);
            await _materialRepository.SaveChangesAsync();

            return material.ToResponseDto();
        }

        public async Task DeleteAsync(int instructorId, int materialId)
        {
            var material = await GetOwnedMaterialAsync(instructorId, materialId);

            _materialRepository.Delete(material);
            await _materialRepository.SaveChangesAsync();
        }

        // The material exists (404) and belongs to one of my courses (403)
        private async Task<Material> GetOwnedMaterialAsync(int instructorId, int materialId)
        {
            var material = await _materialRepository.GetByIdAsync(materialId)
                ?? throw new NotFoundException($"Material with id {materialId} was not found.");

            await _instructorService.EnsureOwnsCourseAsync(instructorId, material.CourseId);
            return material;
        }
    }
}