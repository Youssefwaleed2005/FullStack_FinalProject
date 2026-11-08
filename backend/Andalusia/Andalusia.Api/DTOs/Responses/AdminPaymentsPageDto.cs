namespace Andalusia.Api.DTOs.Responses
{
    // One page of payments + the paid total of everything matching the filters
    public class AdminPaymentsPageDto : PagedResponse<AdminPaymentDto>
    {
        public decimal PaidTotal { get; set; }
    }
}
