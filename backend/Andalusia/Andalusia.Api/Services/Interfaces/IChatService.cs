using Andalusia.Api.DTOs.Requests;
using Andalusia.Api.DTOs.Responses;

namespace Andalusia.Api.Services.Interfaces
{
    public interface IChatService
    {
        // learnerId is set when a signed-in learner is chatting, so answers can use their own courses
        Task<ChatResponseDto> AskAsync(ChatRequestDto request, int? learnerId);

        // Loads the model and reads the catalog once, so the first real question is fast.
        // Returns false when Ollama is not reachable.
        Task<bool> WarmUpAsync(CancellationToken cancellationToken);
    }
}
