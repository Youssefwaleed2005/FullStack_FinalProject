namespace Andalusia.Api.DTOs.Responses
{
    // Chart data for the admin overview
    public class AdminStatsDto
    {
        // Last 6 months, oldest first, e.g. { "Month": "Nov 2026", "Revenue": 12500 }
        public List<MonthlyRevenueDto> RevenueByMonth { get; set; } = new();

        // Enrollments per category, biggest first
        public List<CategoryCountDto> EnrollmentsByCategory { get; set; } = new();
    }

    public class MonthlyRevenueDto
    {
        public string Month { get; set; } = string.Empty;
        public decimal Revenue { get; set; }
        public int Payments { get; set; }
    }

    public class CategoryCountDto
    {
        public string Category { get; set; } = string.Empty;
        public int Count { get; set; }
    }
}
