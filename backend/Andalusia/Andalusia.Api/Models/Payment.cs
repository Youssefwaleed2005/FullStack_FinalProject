using System.ComponentModel.DataAnnotations;
using Microsoft.EntityFrameworkCore;
using Andalusia.Api.Enums;

namespace Andalusia.Api.Models
{
    public class Payment
    {
        public int Id { get; set; }

        [Precision(10, 2)]
        public decimal Amount { get; set; }

        [Required]
        [MaxLength(3)]
        public string Currency { get; set; } = "EGP";

        public PaymentMethod Method { get; set; }

        public PaymentStatus Status { get; set; } = PaymentStatus.Pending;

        [MaxLength(100)]
        public string? TransactionId { get; set; }

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        public DateTime? PaidAt { get; set; }

        // Which application this payment is for
        public int ApplicationId { get; set; }
        public Application Application { get; set; } = null!;
    }
}