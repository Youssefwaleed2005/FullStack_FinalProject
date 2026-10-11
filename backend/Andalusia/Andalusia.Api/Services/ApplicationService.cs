using Andalusia.Api.DTOs.Requests;
using Andalusia.Api.DTOs.Responses;
using Andalusia.Api.Enums;
using Andalusia.Api.Exceptions;
using Andalusia.Api.Mapping;
using Andalusia.Api.Models;
using Andalusia.Api.Repos.Interfaces;
using Andalusia.Api.Services.Interfaces;

namespace Andalusia.Api.Services
{
    public class ApplicationService : IApplicationService
    {
        private readonly IApplicationRepository _applicationRepository;
        private readonly ICourseRepository _courseRepository;
        private readonly IProgramRepository _programRepository;

        public ApplicationService(
            IApplicationRepository applicationRepository,
            ICourseRepository courseRepository,
            IProgramRepository programRepository)
        {
            _applicationRepository = applicationRepository;
            _courseRepository = courseRepository;
            _programRepository = programRepository;
        }

        public async Task<ApplicationResponseDto> CreateAsync(int userId, CreateApplicationRequestDto dto)
        {
            // Rule 1: exactly one target
            var hasCourse = dto.CourseId.HasValue;
            var hasProgram = dto.ProgramId.HasValue;

            if (hasCourse == hasProgram)
                throw new BadRequestException("Apply to exactly one course or one program.");

            // Rule 2: the target exists and is open for enrollment
            if (hasCourse)
            {
                var course = await _courseRepository.GetByIdAsync(dto.CourseId!.Value)
                    ?? throw new NotFoundException($"Course with id {dto.CourseId} was not found.");

                if (course.Status != CatalogStatus.OpenForEnrollment)
                    throw new BadRequestException($"'{course.Title}' is not open for enrollment.");
            }
            else
            {
                var program = await _programRepository.GetByIdAsync(dto.ProgramId!.Value)
                    ?? throw new NotFoundException($"Program with id {dto.ProgramId} was not found.");

                if (program.Status != CatalogStatus.OpenForEnrollment)
                    throw new BadRequestException($"'{program.Title}' is not open for enrollment.");
            }

            // Rule 3: no duplicate active application
            if (await _applicationRepository.HasActiveApplicationAsync(userId, dto.CourseId, dto.ProgramId))
                throw new ConflictException("You already have an active application for this. Check My Applications.");

            var application = new Application
            {
                UserId = userId,
                CourseId = dto.CourseId,
                ProgramId = dto.ProgramId,
                Notes = string.IsNullOrWhiteSpace(dto.Notes) ? null : dto.Notes.Trim(),
                Status = ApplicationStatus.Submitted
            };

            await _applicationRepository.AddAsync(application);
            await _applicationRepository.SaveChangesAsync();

            // Reload with the course/program so the response has its title and price
            var created = await _applicationRepository.GetByIdWithTargetAsync(application.Id);
            return created!.ToResponseDto();
        }

        public async Task<IEnumerable<ApplicationResponseDto>> GetMyApplicationsAsync(int userId)
        {
            var applications = await _applicationRepository.GetByUserAsync(userId);
            return applications.Select(a => a.ToResponseDto());
        }
    }
}