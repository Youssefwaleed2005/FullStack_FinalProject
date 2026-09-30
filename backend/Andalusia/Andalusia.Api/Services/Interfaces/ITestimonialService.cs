using Andalusia.Api.DTOs.Requests;
using Andalusia.Api.DTOs.Responses;

namespace Andalusia.Api.Services.Interfaces
{
    public interface ITestimonialService
    {
        Task<IEnumerable<TestimonialResponseDto>> GetPublishedAsync(int? take);
        Task<TestimonialResponseDto> GetByIdAsync(int id);
        Task<TestimonialResponseDto> CreateAsync(TestimonialRequestDto dto);
        Task<TestimonialResponseDto> UpdateAsync(int id, TestimonialRequestDto dto);
        Task DeleteAsync(int id);
    }
}