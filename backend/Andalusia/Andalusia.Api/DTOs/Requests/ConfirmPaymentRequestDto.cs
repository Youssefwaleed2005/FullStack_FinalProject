using System.ComponentModel.DataAnnotations;

namespace Andalusia.Api.DTOs.Requests
{
    public class ConfirmPaymentRequestDto
    {
        [Required(ErrorMessage = "Card holder name is required.")]
        [MaxLength(100)]
        public string CardHolderName { get; set; } = string.Empty;

        [Required(ErrorMessage = "Card number is required.")]
        [RegularExpression(@"^\d{16}$", ErrorMessage = "Card number must be 16 digits.")]
        public string CardNumber { get; set; } = string.Empty;

        [Required(ErrorMessage = "Expiry date is required.")]
        [RegularExpression(@"^(0[1-9]|1[0-2])\/\d{2}$", ErrorMessage = "Expiry must be in MM/YY format.")]
        public string Expiry { get; set; } = string.Empty;

        [Required(ErrorMessage = "CVV is required.")]
        [RegularExpression(@"^\d{3}$", ErrorMessage = "CVV must be 3 digits.")]
        public string Cvv { get; set; } = string.Empty;
    }
}