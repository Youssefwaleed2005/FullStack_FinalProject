using System.ComponentModel.DataAnnotations;

namespace Andalusia.Api.DTOs.Requests
{
    public class AssignInstructorRequestDto
    {
        [Range(1, int.MaxValue)]
        public int InstructorId { get; set; }
    }
}