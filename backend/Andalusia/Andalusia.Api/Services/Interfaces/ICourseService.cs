using Andalusia.Api.DTOs.Requests;
using Andalusia.Api.DTOs.Responses;

namespace Andalusia.Api.Services.Interfaces
{
    public interface ICourseService
    {
        Task<PagedResponse<CourseResponseDto>> GetAllAsync(CourseQueryParameters query);
        Task<CourseDetailsResponseDto> GetByIdAsync(int id);
        Task<CourseDetailsResponseDto> CreateAsync(CourseRequestDto dto);
        Task<CourseDetailsResponseDto> UpdateAsync(int id, CourseRequestDto dto);
        Task DeleteAsync(int id);
        Task<IEnumerable<CourseResponseDto>> GetRelatedAsync(int id, int take);
    }
}