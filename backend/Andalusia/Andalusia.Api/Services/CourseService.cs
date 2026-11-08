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
        private readonly ISessionRepository _sessionRepository;

        public CourseService(ICourseRepository courseRepository, ISessionRepository sessionRepository)
        {
            _courseRepository = courseRepository;
            _sessionRepository = sessionRepository;
        }

        public async Task<CourseReviewsDto> GetReviewsAsync(int id)
        {
            _ = await _courseRepository.GetByIdWithDetailsAsync(id)
                ?? throw new NotFoundException($"Course with id {id} was not found.");

            return (await _courseRepository.GetReviewsAsync(id)).ToSummaryDto();
        }

        // The course's sessions in order (titles and times only; no meeting links)
        public async Task<List<CourseScheduleItemDto>> GetScheduleAsync(int id)
        {
            _ = await _courseRepository.GetByIdWithDetailsAsync(id)
                ?? throw new NotFoundException($"Course with id {id} was not found.");

            var sessions = await _sessionRepository.GetByCourseAsync(id);
            return sessions
                .OrderBy(s => s.StartTime)
                .Select(s => new CourseScheduleItemDto
                {
                    Id = s.Id,
                    Title = s.Title,
                    Description = s.Description,
                    StartTime = s.StartTime,
                    EndTime = s.EndTime
                })
                .ToList();
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

        public async Task<CourseDetailsResponseDto> CreateAsync(CourseRequestDto dto, int actorId)
        {
            await ValidateAsync(dto);

            var course = dto.ToEntity();
            course.UpdatedAt = DateTime.UtcNow;
            course.UpdatedBy = await _courseRepository.GetUserFullNameAsync(actorId);

            await _courseRepository.AddAsync(course);
            await _courseRepository.SaveChangesAsync();

            return await GetByIdAsync(course.Id);
        }

        public async Task<CourseDetailsResponseDto> UpdateAsync(int id, CourseRequestDto dto, int actorId)
        {
            var course = await _courseRepository.GetByIdAsync(id);

            if (course == null)
                throw new NotFoundException($"Course with id {id} was not found.");

            await ValidateAsync(dto);

            dto.UpdateEntity(course);
            course.UpdatedAt = DateTime.UtcNow;
            course.UpdatedBy = await _courseRepository.GetUserFullNameAsync(actorId);

            _courseRepository.Update(course);
            await _courseRepository.SaveChangesAsync();

            return await GetByIdAsync(id);
        }

        public async Task<bool> DeleteAsync(int id, int actorId)
        {
            var course = await _courseRepository.GetIncludingDeletedAsync(id);

            if (course == null || course.IsDeleted)
                throw new NotFoundException($"Course with id {id} was not found.");

            // Courses with history are archived (soft delete) so enrollments and payments stay intact
            if (await _courseRepository.HasApplicationsOrProgramsAsync(id))
            {
                course.IsDeleted = true;
                course.DeletedAt = DateTime.UtcNow;
                course.UpdatedAt = DateTime.UtcNow;
                course.UpdatedBy = await _courseRepository.GetUserFullNameAsync(actorId);
                await _courseRepository.SaveChangesAsync();
                return true;
            }

            _courseRepository.Delete(course);
            await _courseRepository.SaveChangesAsync();
            return false;
        }

        public async Task RestoreAsync(int id, int actorId)
        {
            var course = await _courseRepository.GetIncludingDeletedAsync(id)
                ?? throw new NotFoundException($"Course with id {id} was not found.");

            if (!course.IsDeleted)
                throw new BadRequestException("This course is not archived.");

            course.IsDeleted = false;
            course.DeletedAt = null;
            course.UpdatedAt = DateTime.UtcNow;
            course.UpdatedBy = await _courseRepository.GetUserFullNameAsync(actorId);
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
        public async Task<IEnumerable<CourseResponseDto>> GetRelatedAsync(int id, int take)
        {
            var course = await _courseRepository.GetByIdAsync(id);

            if (course == null)
                throw new NotFoundException($"Course with id {id} was not found.");

            take = Math.Clamp(take, 1, 12);

            var related = await _courseRepository.GetRelatedAsync(id, course.CategoryId, take);

            return related.Select(c => c.ToResponseDto());
        }
    }
}