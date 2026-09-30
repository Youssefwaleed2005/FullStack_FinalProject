using Andalusia.Api.DTOs.Requests;
using Andalusia.Api.DTOs.Responses;
using Andalusia.Api.Exceptions;
using Andalusia.Api.Mapping;
using Andalusia.Api.Repos.Interfaces;
using Andalusia.Api.Services.Interfaces;

namespace Andalusia.Api.Services
{
    public class TestimonialService : ITestimonialService
    {
        private readonly ITestimonialRepository _repo;

        public TestimonialService(ITestimonialRepository repo)
        {
            _repo = repo;
        }

        public async Task<IEnumerable<TestimonialResponseDto>> GetPublishedAsync(int? take)
        {
            var items = await _repo.GetPublishedAsync(take);
            return items.Select(t => t.ToResponseDto());
        }

        public async Task<TestimonialResponseDto> GetByIdAsync(int id)
        {
            var testimonial = await _repo.GetByIdAsync(id)
                ?? throw new NotFoundException($"Testimonial {id} not found");
            return testimonial.ToResponseDto();
        }

        public async Task<TestimonialResponseDto> CreateAsync(TestimonialRequestDto dto)
        {
            var testimonial = dto.ToEntity();
            await _repo.AddAsync(testimonial);
            await _repo.SaveChangesAsync();
            return testimonial.ToResponseDto();
        }

        public async Task<TestimonialResponseDto> UpdateAsync(int id, TestimonialRequestDto dto)
        {
            var testimonial = await _repo.GetByIdAsync(id)
                ?? throw new NotFoundException($"Testimonial {id} not found");
            dto.UpdateEntity(testimonial);
            await _repo.SaveChangesAsync();
            return testimonial.ToResponseDto();
        }

        public async Task DeleteAsync(int id)
        {
            var testimonial = await _repo.GetByIdAsync(id)
                ?? throw new NotFoundException($"Testimonial {id} not found");
            _repo.Delete(testimonial);
            await _repo.SaveChangesAsync();
        }
    }
}