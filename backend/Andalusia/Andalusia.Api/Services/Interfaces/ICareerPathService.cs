using Andalusia.Api.DTOs.Requests;
using Andalusia.Api.DTOs.Responses;

namespace Andalusia.Api.Services.Interfaces
{
    public interface ICareerPathService
    {
        Task<IEnumerable<CareerPathResponseDto>> GetPublishedAsync(bool? isFeatured, int? take);
        Task<CareerPathDetailsResponseDto> GetByIdAsync(int id);
        Task<CareerPathDetailsResponseDto> CreateAsync(CareerPathRequestDto dto);
        Task<CareerPathDetailsResponseDto> UpdateAsync(int id, CareerPathRequestDto dto);
        Task DeleteAsync(int id);
    }
}