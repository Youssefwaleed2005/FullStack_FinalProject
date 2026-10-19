using Andalusia.Api.DTOs.Requests;
using Andalusia.Api.DTOs.Responses;
using Andalusia.Api.Exceptions;
using Andalusia.Api.Mapping;
using Andalusia.Api.Models;
using Andalusia.Api.Repos.Interfaces;
using Andalusia.Api.Services.Interfaces;

namespace Andalusia.Api.Services
{
    public class SessionService : ISessionService
    {
        private readonly ISessionRepository _sessionRepository;
        private readonly IInstructorService _instructorService;

        public SessionService(ISessionRepository sessionRepository, IInstructorService instructorService)
        {
            _sessionRepository = sessionRepository;
            _instructorService = instructorService;
        }

        public async Task<List<SessionResponseDto>> GetByCourseAsync(int instructorId, int courseId)
        {
            await _instructorService.EnsureOwnsCourseAsync(instructorId, courseId);

            var sessions = await _sessionRepository.GetByCourseAsync(courseId);
            return sessions.Select(s => s.ToResponseDto()).ToList();
        }

        public async Task<SessionResponseDto> CreateAsync(int instructorId, int courseId, SessionRequestDto dto)
        {
            await _instructorService.EnsureOwnsCourseAsync(instructorId, courseId);
            EnsureValidTimes(dto);

            var session = dto.ToEntity(courseId);
            await _sessionRepository.AddAsync(session);
            await _sessionRepository.SaveChangesAsync();

            return session.ToResponseDto();
        }

        public async Task<SessionResponseDto> UpdateAsync(int instructorId, int sessionId, SessionRequestDto dto)
        {
            var session = await GetOwnedSessionAsync(instructorId, sessionId);
            EnsureValidTimes(dto);

            dto.UpdateEntity(session);
            await _sessionRepository.SaveChangesAsync();

            return session.ToResponseDto();
        }

        public async Task DeleteAsync(int instructorId, int sessionId)
        {
            var session = await GetOwnedSessionAsync(instructorId, sessionId);

            if (await _sessionRepository.HasAttendanceAsync(sessionId))
                throw new ConflictException("Attendance was already taken for this session, so it cannot be deleted.");

            _sessionRepository.Delete(session);
            await _sessionRepository.SaveChangesAsync();
        }

        // The session exists (404) and belongs to one of my courses (403)
        private async Task<Session> GetOwnedSessionAsync(int instructorId, int sessionId)
        {
            var session = await _sessionRepository.GetByIdAsync(sessionId)
                ?? throw new NotFoundException($"Session with id {sessionId} was not found.");

            await _instructorService.EnsureOwnsCourseAsync(instructorId, session.CourseId);
            return session;
        }

        private static void EnsureValidTimes(SessionRequestDto dto)
        {
            if (dto.EndTime <= dto.StartTime)
                throw new BadRequestException("End time must be after start time.");
        }
    }
}