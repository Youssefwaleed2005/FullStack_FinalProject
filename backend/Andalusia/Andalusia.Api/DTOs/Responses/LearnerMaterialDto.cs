namespace Andalusia.Api.DTOs.Responses
{
    // A material as the learner sees it: same fields + "did I finish it?"
    public class LearnerMaterialDto : MaterialResponseDto
    {
        public bool IsCompleted { get; set; }
        public DateTime? CompletedAt { get; set; }
    }

    // Returned after marking a material done / not done, so the page can update the progress bar
    public class MaterialCompletionResultDto
    {
        public int MaterialId { get; set; }
        public bool IsCompleted { get; set; }
        public LearnerProgressDto Progress { get; set; } = new();
    }
}
