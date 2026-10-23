namespace Andalusia.Api.DTOs.Responses
{
    public class ChatResponseDto
    {
        public string Reply { get; set; } = string.Empty;

        // Courses / programs / career paths named in the reply, so the widget can show links
        public List<ChatLinkDto> Links { get; set; } = new();
    }

    public class ChatLinkDto
    {
        // "Course", "Program" or "CareerPath"
        public string Type { get; set; } = string.Empty;
        public int Id { get; set; }
        public string Title { get; set; } = string.Empty;
    }
}
