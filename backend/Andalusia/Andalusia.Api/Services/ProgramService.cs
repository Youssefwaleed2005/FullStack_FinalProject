using Andalusia.Api.DTOs.Requests;
using Andalusia.Api.DTOs.Responses;
using Andalusia.Api.Exceptions;
using Andalusia.Api.Mapping;
using Andalusia.Api.Models;
using Andalusia.Api.Repos.Interfaces;
using Andalusia.Api.Services.Interfaces;

namespace Andalusia.Api.Services
{
    public class ProgramService : IProgramService
    {
        private readonly IProgramRepository _programRepository;

        public ProgramService(IProgramRepository programRepository)
        {
            _programRepository = programRepository;
        }

        public async Task<PagedResponse<ProgramResponseDto>> GetAllAsync(ProgramQueryParameters query)
        {
            if (query.MinPrice.HasValue && query.MaxPrice.HasValue && query.MinPrice > query.MaxPrice)
                throw new BadRequestException("Minimum price cannot be greater than maximum price.");

            var (programs, totalCount) = await _programRepository.GetPagedAsync(query);

            return new PagedResponse<ProgramResponseDto>
            {
                Items = programs.Select(p => p.ToResponseDto()),
                PageNumber = query.PageNumber,
                PageSize = query.PageSize,
                TotalCount = totalCount
            };
        }

        public async Task<ProgramDetailsResponseDto> GetByIdAsync(int id)
        {
            var program = await _programRepository.GetByIdWithDetailsAsync(id);

            if (program == null)
                throw new NotFoundException($"Program with id {id} was not found.");

            return program.ToDetailsResponseDto();
        }

        public async Task<ProgramDetailsResponseDto> CreateAsync(ProgramRequestDto dto)
        {
            await ValidateAsync(dto);

            var program = dto.ToEntity();

            
            for (int i = 0; i < dto.CourseIds.Count; i++)
            {
                program.ProgramCourses.Add(new ProgramCourse
                {
                    CourseId = dto.CourseIds[i],
                    SortOrder = i + 1
                });
            }

            await _programRepository.AddAsync(program);
            await _programRepository.SaveChangesAsync();

            return await GetByIdAsync(program.Id);
        }

        public async Task<ProgramDetailsResponseDto> UpdateAsync(int id, ProgramRequestDto dto)
        {
            var program = await _programRepository.GetByIdAsync(id);

            if (program == null)
                throw new NotFoundException($"Program with id {id} was not found.");

            await ValidateAsync(dto);

            dto.UpdateEntity(program);
            _programRepository.Update(program);

            await _programRepository.ReplaceProgramCoursesAsync(id, dto.CourseIds);

            await _programRepository.SaveChangesAsync();

            return await GetByIdAsync(id);
        }

        public async Task DeleteAsync(int id)
        {
            var program = await _programRepository.GetByIdAsync(id);

            if (program == null)
                throw new NotFoundException($"Program with id {id} was not found.");

            if (await _programRepository.HasApplicationsOrCareerPathsAsync(id))
                throw new ConflictException("This program cannot be deleted because it has applications or belongs to a career path. Change its status instead.");

        
            await _programRepository.ReplaceProgramCoursesAsync(id, new List<int>());

            _programRepository.Delete(program);
            await _programRepository.SaveChangesAsync();
        }


        private async Task ValidateAsync(ProgramRequestDto dto)
        {
            if (!await _programRepository.CategoryExistsAsync(dto.CategoryId))
                throw new BadRequestException($"Category with id {dto.CategoryId} does not exist.");

            if (dto.CourseIds.Count != dto.CourseIds.Distinct().Count())
                throw new BadRequestException("The same course cannot be added to a program twice.");

            if (dto.CourseIds.Count > 0)
            {
                var existingIds = await _programRepository.GetExistingCourseIdsAsync(dto.CourseIds);
                var missingIds = dto.CourseIds.Except(existingIds).ToList();

                if (missingIds.Count > 0)
                    throw new BadRequestException($"These course ids do not exist: {string.Join(", ", missingIds)}.");
            }

            if (dto.StartDate.HasValue && dto.EndDate.HasValue && dto.EndDate < dto.StartDate)
                throw new BadRequestException("End date cannot be before start date.");
        }

        public async Task<IEnumerable<ProgramResponseDto>> GetRelatedAsync(int id, int take)
        {
            var program = await _programRepository.GetByIdAsync(id);

            if (program == null)
                throw new NotFoundException($"Program with id {id} was not found.");

            take = Math.Clamp(take, 1, 12);

            var related = await _programRepository.GetRelatedAsync(id, program.CategoryId, take);

            return related.Select(p => p.ToResponseDto());
        }
    }
}