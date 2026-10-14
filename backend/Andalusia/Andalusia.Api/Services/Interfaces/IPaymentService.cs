using Andalusia.Api.DTOs.Requests;
using Andalusia.Api.DTOs.Responses;

namespace Andalusia.Api.Services.Interfaces
{
    public interface IPaymentService
    {
        Task<PaymentResponseDto> CreateAsync(int userId, CreatePaymentRequestDto dto);
        Task<PaymentResponseDto> ConfirmAsync(int userId, int paymentId, ConfirmPaymentRequestDto dto);
        Task<IEnumerable<PaymentResponseDto>> GetMyPaymentsAsync(int userId);
    }
}