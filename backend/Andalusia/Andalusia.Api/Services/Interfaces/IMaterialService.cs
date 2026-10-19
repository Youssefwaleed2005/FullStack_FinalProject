using Andalusia.Api.DTOs.Requests;
using Andalusia.Api.DTOs.Responses;

namespace Andalusia.Api.Services.Interfaces
{
    public interface IMaterialService
    {
        Task<List<MaterialResponseDto>> GetByCourseAsync(int instructorId, int courseId);
        Task<MaterialResponseDto> CreateAsync(int instructorId, int courseId, MaterialRequestDto dto);
        Task<MaterialResponseDto> UpdateAsync(int instructorId, int materialId, MaterialRequestDto dto);
        Task DeleteAsync(int instructorId, int materialId);
    }
}