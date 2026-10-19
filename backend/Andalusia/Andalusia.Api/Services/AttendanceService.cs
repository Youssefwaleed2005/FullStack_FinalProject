using Andalusia.Api.DTOs.Requests;
using Andalusia.Api.DTOs.Responses;
using Andalusia.Api.Exceptions;
using Andalusia.Api.Models;
using Andalusia.Api.Repos.Interfaces;
using Andalusia.Api.Services.Interfaces;

namespace Andalusia.Api.Services
{
    public class AttendanceService : IAttendanceService
    {
        private readonly IAttendanceRepository _attendanceRepository;
        private readonly ISessionRepository _sessionRepository;
        private readonly IInstructorRepository _instructorRepository;
        private readonly IInstructorService _instructorService;

        public AttendanceService(
            IAttendanceRepository attendanceRepository,
            ISessionRepository sessionRepository,
            IInstructorRepository instructorRepository,
            IInstructorService instructorService)
        {
            _attendanceRepository = attendanceRepository;
            _sessionRepository = sessionRepository;
            _instructorRepository = instructorRepository;
            _instructorService = instructorService;
        }

        public async Task<SessionAttendanceDto> GetSessionAttendanceAsync(int instructorId, int sessionId)
        {
            var session = await GetOwnedSessionAsync(instructorId, sessionId);
            return await BuildRosterAsync(session);
        }

        public async Task<SessionAttendanceDto> MarkAttendanceAsync(int instructorId, int sessionId, MarkAttendanceRequestDto dto)
        {
            var session = await GetOwnedSessionAsync(instructorId, sessionId);

            // Guard: the session has started
            if (session.StartTime > DateTime.UtcNow)
                throw new BadRequestException("You cannot take attendance before the session starts.");

            // Guard: every learner in the request is enrolled in this course
            var enrollments = await _instructorRepository.GetActiveEnrollmentsAsync(session.CourseId);
            var enrolledIds = enrollments.Select(e => e.Application.UserId).ToHashSet();

            var notEnrolled = dto.Records.Select(r => r.UserId).Where(id => !enrolledIds.Contains(id)).ToList();
            if (notEnrolled.Any())
                throw new BadRequestException($"These users are not enrolled in this course: {string.Join(", ", notEnrolled)}.");

            // Update existing rows, add new ones (no duplicates)
            var existing = await _attendanceRepository.GetBySessionAsync(sessionId);
            var now = DateTime.UtcNow;

            foreach (var record in dto.Records)
            {
                var row = existing.FirstOrDefault(a => a.UserId == record.UserId);
                if (row != null)
                {
                    row.Status = record.Status;
                    row.MarkedAt = now;
                }
                else
                {
                    await _attendanceRepository.AddAsync(new Attendance
                    {
                        SessionId = sessionId,
                        UserId = record.UserId,
                        Status = record.Status,
                        MarkedAt = now
                    });
                }
            }

            await _attendanceRepository.SaveChangesAsync();
            return await BuildRosterAsync(session);
        }

        // Everyone enrolled in the course + their status for this session
        private async Task<SessionAttendanceDto> BuildRosterAsync(Session session)
        {
            var enrollments = await _instructorRepository.GetActiveEnrollmentsAsync(session.CourseId);
            var records = await _attendanceRepository.GetBySessionAsync(session.Id);

            return new SessionAttendanceDto
            {
                SessionId = session.Id,
                CourseId = session.CourseId,
                SessionTitle = session.Title,
                StartTime = session.StartTime,
                Students = enrollments.Select(e =>
                {
                    var user = e.Application.User;
                    var record = records.FirstOrDefault(a => a.UserId == user.Id);
                    return new StudentAttendanceDto
                    {
                        UserId = user.Id,
                        FullName = $"{user.FirstName} {user.LastName}",
                        Email = user.Email,
                        Status = record?.Status,
                        MarkedAt = record?.MarkedAt
                    };
                }).ToList()
            };
        }

        private async Task<Session> GetOwnedSessionAsync(int instructorId, int sessionId)
        {
            var session = await _sessionRepository.GetByIdAsync(sessionId)
                ?? throw new NotFoundException($"Session with id {sessionId} was not found.");

            await _instructorService.EnsureOwnsCourseAsync(instructorId, session.CourseId);
            return session;
        }
    }
}