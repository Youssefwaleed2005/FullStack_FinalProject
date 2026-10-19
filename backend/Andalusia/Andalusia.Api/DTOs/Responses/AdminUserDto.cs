namespace Andalusia.Api.DTOs.Responses
{
    // A user (learner / instructor / admin) as the admin sees it
    public class AdminUserDto
    {
        public int Id { get; set; }
        public string FirstName { get; set; } = string.Empty;
        public string LastName { get; set; } = string.Empty;
        public string FullName { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public string? PhoneNumber { get; set; }
        public string? Country { get; set; }
        public string? Specialization { get; set; }

        public List<string> Roles { get; set; } = new();
        public bool IsActive { get; set; }
        public DateTime CreatedAt { get; set; }

        public int ActiveEnrollments { get; set; }   // for learners
        public int CoursesTaught { get; set; }       // for instructors
    }
}