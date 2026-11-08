namespace Andalusia.Api.DTOs.Responses
{
    // One item in the learner's notifications bell. Built from existing data (no table needed).
    public class LearnerNotificationDto
    {
        // Stable id like "graded-12", so the browser can remember which ones were read
        public string Id { get; set; } = string.Empty;

        // "Graded", "NewMaterial", "NewAssignment", "DueSoon", "SessionSoon"
        public string Type { get; set; } = string.Empty;

        public string Title { get; set; } = string.Empty;
        public string Message { get; set; } = string.Empty;
        public int CourseId { get; set; }
        public string CourseTitle { get; set; } = string.Empty;

        // When it happened (or will happen, for sessions / deadlines), UTC
        public DateTime Time { get; set; }
    }
}
