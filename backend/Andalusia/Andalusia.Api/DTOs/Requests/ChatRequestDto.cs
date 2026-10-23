using System.ComponentModel.DataAnnotations;

namespace Andalusia.Api.DTOs.Requests
{
    // POST /api/chat   { "messages": [ { "role": "user", "content": "Which course is good for beginners?" } ] }
    // The frontend sends the whole conversation each time (the API does not store chats).
    public class ChatRequestDto
    {
        [Required, MinLength(1), MaxLength(20)]
        public List<ChatMessageDto> Messages { get; set; } = new();
    }

    public class ChatMessageDto
    {
        // "user" or "assistant"
        [Required, RegularExpression("^(user|assistant)$")]
        public string Role { get; set; } = "user";

        // Assistant replies can be long, so the limit is generous (the widget limits what users type to 1000)
        [Required, MaxLength(4000)]
        public string Content { get; set; } = string.Empty;
    }
}
