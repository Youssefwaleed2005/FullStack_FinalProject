namespace Andalusia.Api.DTOs.Responses
{
    // Learning activity per day (sessions attended, assignments submitted, materials completed)
    public class LearnerActivityDto
    {
        // The last 18 weeks, oldest first, one entry per day (count can be 0)
        public List<ActivityDayDto> Days { get; set; } = new();
        public int CurrentStreak { get; set; }   // days in a row up to today (or yesterday)
        public int LongestStreak { get; set; }
        public int TotalActions { get; set; }
    }

    public class ActivityDayDto
    {
        public string Date { get; set; } = string.Empty;   // "2026-11-08"
        public int Count { get; set; }
    }
}
