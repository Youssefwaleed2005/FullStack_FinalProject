namespace Andalusia.Api.DTOs.Responses
{
    // "Last edited by Admin User · 2 days ago"
    public class LastEditDto
    {
        public DateTime? UpdatedAt { get; set; }
        public string? UpdatedBy { get; set; }
    }
}
