using System.ComponentModel.DataAnnotations;
using Andalusia.Api.Enums;

namespace Andalusia.Api.DTOs.Requests
{
    // Save attendance for a whole session in one request
    public class MarkAttendanceRequestDto
    {
        [Required]
        [MinLength(1)]
        public List<AttendanceRecordDto> Records { get; set; } = new();
    }

    public class AttendanceRecordDto
    {
        [Range(1, int.MaxValue)]
        public int UserId { get; set; }

        public AttendanceStatus Status { get; set; }
    }
}