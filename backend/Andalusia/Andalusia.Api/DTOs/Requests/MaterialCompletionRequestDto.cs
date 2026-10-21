namespace Andalusia.Api.DTOs.Requests
{
    // PUT /api/learner/materials/5/completion   { "completed": true }
    public class MaterialCompletionRequestDto
    {
        public bool Completed { get; set; } = true;
    }
}
