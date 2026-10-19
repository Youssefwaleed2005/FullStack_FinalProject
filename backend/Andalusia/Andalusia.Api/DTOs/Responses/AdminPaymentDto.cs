using Andalusia.Api.Enums;

namespace Andalusia.Api.DTOs.Responses
{
    // A payment as the admin sees it (with who paid and for what)
    public class AdminPaymentDto
    {
        public int Id { get; set; }
        public decimal Amount { get; set; }
        public string Currency { get; set; } = string.Empty;
        public PaymentMethod Method { get; set; }
        public PaymentStatus Status { get; set; }
        public string? TransactionId { get; set; }
        public DateTime CreatedAt { get; set; }
        public DateTime? PaidAt { get; set; }

        public int UserId { get; set; }
        public string StudentName { get; set; } = string.Empty;
        public string StudentEmail { get; set; } = string.Empty;

        public string TargetType { get; set; } = string.Empty;   // "Course" or "Program"
        public string TargetTitle { get; set; } = string.Empty;
    }
}