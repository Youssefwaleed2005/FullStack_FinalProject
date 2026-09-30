using Andalusia.Api.DTOs.Requests;
using Andalusia.Api.DTOs.Responses;
using Andalusia.Api.Exceptions;
using Andalusia.Api.Mapping;
using Andalusia.Api.Repos.Interfaces;
using Andalusia.Api.Services.Interfaces;

namespace Andalusia.Api.Services
{
    public class CourseService : ICourseService
    {
        private readonly ICourseRepository _courseRepository;

        public CourseService(ICourseRepository courseRepository)
        {
            _courseRepository = courseRepository;
        }

        public async Task<PagedResponse<CourseResponseDto>> GetAllAsync(CourseQueryParameters query)
        {
            if (query.MinPrice.HasValue && query.MaxPrice.HasValue && query.MinPrice > query.MaxPrice)
                throw new BadRequestException("Minimum price cannot be greater than maximum price.");

            var (courses, totalCount) = await _courseRepository.GetPagedAsync(query);

            return new PagedResponse<CourseResponseDto>
            {
                Items = courses.Select(c => c.ToResponseDto()),
                PageNumber = query.PageNumber,
                PageSize = query.PageSize,
                TotalCount = totalCount
            };
        }

        public async Task<CourseDetailsResponseDto> GetByIdAsync(int id)
        {
            var course = await _courseRepository.GetByIdWithDetailsAsync(id);

            if (course == null)
                throw new NotFoundException($"Course with id {id} was not found.");

            return course.ToDetailsResponseDto();
        }

        public async Task<CourseDetailsResponseDto> CreateAsync(CourseRequestDto dto)
        {
            await ValidateAsync(dto);

            var course = dto.ToEntity();

            await _courseRepository.AddAsync(course);
            await _courseRepository.SaveChangesAsync();

            return await GetByIdAsync(course.Id);
        }

        public async Task<CourseDetailsResponseDto> UpdateAsync(int id, CourseRequestDto dto)
        {
            var course = await _courseRepository.GetByIdAsync(id);

            if (course == null)
                throw new NotFoundException($"Course with id {id} was not found.");

            await ValidateAsync(dto);

            dto.UpdateEntity(course);

            _courseRepository.Update(course);
            await _courseRepository.SaveChangesAsync();

            return await GetByIdAsync(id);
        }

        public async Task DeleteAsync(int id)
        {
            var course = await _courseRepository.GetByIdAsync(id);

            if (course == null)
                throw new NotFoundException($"Course with id {id} was not found.");

            if (await _courseRepository.HasApplicationsOrProgramsAsync(id))
                throw new ConflictException("This course cannot be deleted because it has applications or belongs to a program. Change its status instead.");

            _courseRepository.Delete(course);
            await _courseRepository.SaveChangesAsync();
        }

     
        private async Task ValidateAsync(CourseRequestDto dto)
        {
            if (!await _courseRepository.CategoryExistsAsync(dto.CategoryId))
                throw new BadRequestException($"Category with id {dto.CategoryId} does not exist.");

            if (dto.InstructorId.HasValue && !await _courseRepository.InstructorExistsAsync(dto.InstructorId.Value))
                throw new BadRequestException($"User with id {dto.InstructorId} is not an instructor.");

            if (dto.StartDate.HasValue && dto.EndDate.HasValue && dto.EndDate < dto.StartDate)
                throw new BadRequestException("End date cannot be before start date.");
        }
    }
}