using System.ComponentModel.DataAnnotations;
using Andalusia.Api.Enums;

namespace Andalusia.Api.DTOs.Requests
{
    public class CreatePaymentRequestDto
    {
        [Range(1, int.MaxValue, ErrorMessage = "Please choose an application.")]
        public int ApplicationId { get; set; }

        [EnumDataType(typeof(PaymentMethod), ErrorMessage = "Invalid payment method.")]
        public PaymentMethod Method { get; set; } = PaymentMethod.Card;
    }
}