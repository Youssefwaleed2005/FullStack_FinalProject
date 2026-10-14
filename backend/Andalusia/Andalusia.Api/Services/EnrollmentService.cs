using Andalusia.Api.DTOs.Responses;
using Andalusia.Api.Mapping;
using Andalusia.Api.Repos.Interfaces;
using Andalusia.Api.Services.Interfaces;

namespace Andalusia.Api.Services
{
    public class EnrollmentService : IEnrollmentService
    {
        private readonly IEnrollmentRepository _enrollmentRepository;

        public EnrollmentService(IEnrollmentRepository enrollmentRepository)
        {
            _enrollmentRepository = enrollmentRepository;
        }

        public async Task<IEnumerable<EnrollmentResponseDto>> GetMyEnrollmentsAsync(int userId)
        {
            var enrollments = await _enrollmentRepository.GetByUserAsync(userId);
            return enrollments.Select(e => e.ToResponseDto());
        }
    }
}