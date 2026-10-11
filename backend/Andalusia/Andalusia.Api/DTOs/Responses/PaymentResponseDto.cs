using Andalusia.Api.Enums;

namespace Andalusia.Api.DTOs.Responses
{
    public class PaymentResponseDto
    {
        public int Id { get; set; }
        public int ApplicationId { get; set; }
        public decimal Amount { get; set; }
        public string Currency { get; set; } = string.Empty;
        public PaymentMethod Method { get; set; }
        public PaymentStatus Status { get; set; }
        public string? TransactionId { get; set; }
        public DateTime CreatedAt { get; set; }
        public DateTime? PaidAt { get; set; }

        // What the payment is for
        public string TargetType { get; set; } = string.Empty;   // "Course" or "Program"
        public string TargetTitle { get; set; } = string.Empty;

        // Filled when the payment succeeded and the learner got enrolled
        public int? EnrollmentId { get; set; }
    }
}