using Andalusia.Api.Enums;

namespace Andalusia.Api.Models
{
   
    public class Attendance
    {
        public int Id { get; set; }

        public AttendanceStatus Status { get; set; } = AttendanceStatus.Present;

        public DateTime MarkedAt { get; set; } = DateTime.UtcNow;

        public int SessionId { get; set; }
        public Session Session { get; set; } = null!;

        public int UserId { get; set; }
        public User User { get; set; } = null!;
    }
}