using Andalusia.Api.DTOs.Responses;
using Andalusia.Api.Repos.Interfaces;
using Andalusia.Api.Services.Interfaces;
using Andalusia.Api.Mapping;
public class EnrollmentService : IEnrollmentService
{
    private readonly IEnrollmentRepository _enrollmentRepository;
    private readonly ILearnerService _learnerService;

    public EnrollmentService(IEnrollmentRepository enrollmentRepository, ILearnerService learnerService)
    {
        _enrollmentRepository = enrollmentRepository;
        _learnerService = learnerService;
    }

    public async Task<IEnumerable<EnrollmentResponseDto>> GetMyEnrollmentsAsync(int userId)
    {
        var enrollments = await _enrollmentRepository.GetByUserAsync(userId);
        var progress = await _learnerService.GetEnrollmentProgressAsync(userId);

        // Progress is calculated live from attendance + submissions, not the stored column
        return enrollments.Select(e =>
        {
            var dto = e.ToResponseDto();
            if (progress.TryGetValue(e.Id, out var percent))
                dto.ProgressPercent = percent;
            return dto;
        }).ToList();
    }
}