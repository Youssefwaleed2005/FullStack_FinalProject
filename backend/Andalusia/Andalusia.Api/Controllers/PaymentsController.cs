using Andalusia.Api.DTOs.Requests;
using Andalusia.Api.DTOs.Responses;
using Andalusia.Api.Helpers;
using Andalusia.Api.Services.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Andalusia.Api.Controllers
{
    [ApiController]
    [Route("api/payments")]
    [Authorize(Roles = "Learner")]
    public class PaymentsController : ControllerBase
    {
        private readonly IPaymentService _paymentService;

        public PaymentsController(IPaymentService paymentService)
        {
            _paymentService = paymentService;
        }

        // POST: api/payments  → start (or reuse) a pending payment for an application
        [HttpPost]
        public async Task<ActionResult<PaymentResponseDto>> Create(CreatePaymentRequestDto dto)
        {
            var payment = await _paymentService.CreateAsync(User.GetUserId(), dto);
            return Ok(payment);
        }

        // POST: api/payments/5/confirm  → pay with the simulated card
        [HttpPost("{id:int}/confirm")]
        public async Task<ActionResult<PaymentResponseDto>> Confirm(int id, ConfirmPaymentRequestDto dto)
        {
            var payment = await _paymentService.ConfirmAsync(User.GetUserId(), id, dto);
            return Ok(payment);
        }

        // GET: api/payments/me  → My Payments
        [HttpGet("me")]
        public async Task<ActionResult<IEnumerable<PaymentResponseDto>>> GetMine()
        {
            var payments = await _paymentService.GetMyPaymentsAsync(User.GetUserId());
            return Ok(payments);
        }
    }
}