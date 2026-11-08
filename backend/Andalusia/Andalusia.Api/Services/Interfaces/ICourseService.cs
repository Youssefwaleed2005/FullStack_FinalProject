using Andalusia.Api.DTOs.Requests;
using Andalusia.Api.DTOs.Responses;

namespace Andalusia.Api.Services.Interfaces
{
    public interface ICourseService
    {
        Task<PagedResponse<CourseResponseDto>> GetAllAsync(CourseQueryParameters query);
        Task<CourseDetailsResponseDto> GetByIdAsync(int id);
        Task<CourseDetailsResponseDto> CreateAsync(CourseRequestDto dto, int actorId);
        Task<CourseDetailsResponseDto> UpdateAsync(int id, CourseRequestDto dto, int actorId);
        // Deletes the course, or archives it when it has applications / belongs to a program. Returns true when archived.
        Task<bool> DeleteAsync(int id, int actorId);
        Task RestoreAsync(int id, int actorId);
        Task<IEnumerable<CourseResponseDto>> GetRelatedAsync(int id, int take);
        Task<List<CourseScheduleItemDto>> GetScheduleAsync(int id);
        Task<CourseReviewsDto> GetReviewsAsync(int id);
    }
}