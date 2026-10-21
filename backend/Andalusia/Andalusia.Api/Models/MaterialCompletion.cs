namespace Andalusia.Api.Models
{
    // A learner marked a material as done (counts towards course progress)
    public class MaterialCompletion
    {
        public int Id { get; set; }

        public DateTime CompletedAt { get; set; } = DateTime.UtcNow;

        public int MaterialId { get; set; }
        public Material Material { get; set; } = null!;

        // The learner
        public int UserId { get; set; }
        public User User { get; set; } = null!;
    }
}
