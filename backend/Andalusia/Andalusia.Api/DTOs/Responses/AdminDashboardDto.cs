namespace Andalusia.Api.DTOs.Responses
{
    // Numbers for the admin home page
    public class AdminDashboardDto
    {
        public int LearnerCount { get; set; }
        public int InstructorCount { get; set; }
        public int CourseCount { get; set; }
        public int OpenCourseCount { get; set; }
        public int ProgramCount { get; set; }
        public int ActiveEnrollmentCount { get; set; }
        public int PendingApplicationCount { get; set; }   // applied but not paid yet

        public decimal TotalRevenue { get; set; }
        public decimal RevenueThisMonth { get; set; }

        public List<AdminPaymentDto> RecentPayments { get; set; } = new();
    }
}