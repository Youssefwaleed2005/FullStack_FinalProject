using Andalusia.Api.DTOs.Requests;
using Andalusia.Api.DTOs.Responses;
using Andalusia.Api.Enums;
using Andalusia.Api.Exceptions;
using Andalusia.Api.Mapping;
using Andalusia.Api.Models;
using Andalusia.Api.Repos.Interfaces;
using Andalusia.Api.Services.Interfaces;

namespace Andalusia.Api.Services
{
    public class PaymentService : IPaymentService
    {
        private readonly IPaymentRepository _paymentRepository;
        private readonly IApplicationRepository _applicationRepository;

        public PaymentService(IPaymentRepository paymentRepository, IApplicationRepository applicationRepository)
        {
            _paymentRepository = paymentRepository;
            _applicationRepository = applicationRepository;
        }

        // Step 1: start a payment for one of my applications
        public async Task<PaymentResponseDto> CreateAsync(int userId, CreatePaymentRequestDto dto)
        {
            var application = await _applicationRepository.GetByIdWithTargetAsync(dto.ApplicationId);

            // Guard: the application exists and belongs to me
            if (application == null || application.UserId != userId)
                throw new NotFoundException($"Application with id {dto.ApplicationId} was not found.");

            // Guard: only submitted applications can be paid
            if (application.Status == ApplicationStatus.Accepted)
                throw new ConflictException("This application is already paid and you are enrolled.");

            if (application.Status != ApplicationStatus.Submitted)
                throw new BadRequestException($"This application is {application.Status} and cannot be paid.");

            // Reuse an existing pending payment instead of creating duplicates
            var pending = await _paymentRepository.GetPendingForApplicationAsync(application.Id);
            if (pending != null)
                return pending.ToResponseDto();

            // The amount always comes from the server, never from the request
            var amount = application.Course?.Price ?? application.Program?.Price ?? 0;

            var payment = new Payment
            {
                ApplicationId = application.Id,
                Amount = amount,
                Currency = "EGP",
                Method = dto.Method,
                Status = PaymentStatus.Pending
            };

            await _paymentRepository.AddAsync(payment);
            await _paymentRepository.SaveChangesAsync();

            var created = await _paymentRepository.GetByIdWithDetailsAsync(payment.Id);
            return created!.ToResponseDto();
        }

        // Step 2: confirm the payment (simulated card gateway)
        public async Task<PaymentResponseDto> ConfirmAsync(int userId, int paymentId, ConfirmPaymentRequestDto dto)
        {
            var payment = await _paymentRepository.GetByIdForConfirmAsync(paymentId);

            // Guard: the payment exists and belongs to me
            if (payment == null || payment.Application.UserId != userId)
                throw new NotFoundException($"Payment with id {paymentId} was not found.");

            // Guard: a payment can only be confirmed once
            if (payment.Status != PaymentStatus.Pending)
                throw new ConflictException("This payment has already been processed.");

            var application = payment.Application;

            // Guard: the application must still be waiting for payment
            if (application.Status != ApplicationStatus.Submitted)
                throw new ConflictException($"This application is {application.Status} and cannot be paid.");

            // Guard: the card is not expired
            EnsureCardNotExpired(dto.Expiry);

            // Simulated gateway: cards ending in 0000 are declined
            if (dto.CardNumber.EndsWith("0000"))
            {
                payment.Status = PaymentStatus.Failed;
                payment.TransactionId = $"SIM-DECLINED-{Guid.NewGuid():N}";
                await _paymentRepository.SaveChangesAsync();
                return payment.ToResponseDto();
            }

            // Success: all changes in ONE transaction
            await using var transaction = await _paymentRepository.BeginTransactionAsync();

            // Guard: there is still a place available
            var capacity = application.Course?.Capacity ?? application.Program?.Capacity ?? 0;
            var activeEnrollments = await _paymentRepository.CountActiveEnrollmentsAsync(
                application.CourseId, application.ProgramId);

            if (capacity > 0 && activeEnrollments >= capacity)
                throw new ConflictException("Sorry, this is already full.");

            var now = DateTime.UtcNow;

            // 1. Payment → Paid
            payment.Status = PaymentStatus.Paid;
            payment.PaidAt = now;
            payment.TransactionId = $"SIM-{Guid.NewGuid():N}";

            // 2. Application → Accepted
            application.Status = ApplicationStatus.Accepted;
            application.ReviewedAt = now;

            // 3. Enrollment → created
            application.Enrollment = new Enrollment
            {
                Status = EnrollmentStatus.Active,
                EnrolledAt = now
            };

            // 4. Close any duplicate pending payments for this application
            var duplicates = await _paymentRepository.GetOtherPendingAsync(application.Id, payment.Id);
            foreach (var duplicate in duplicates)
                duplicate.Status = PaymentStatus.Failed;

            // The last place was just taken → mark the course/program as Full
            if (capacity > 0 && activeEnrollments + 1 >= capacity)
            {
                if (application.Course != null) application.Course.Status = CatalogStatus.Full;
                if (application.Program != null) application.Program.Status = CatalogStatus.Full;
            }

            await _paymentRepository.SaveChangesAsync();
            await transaction.CommitAsync();

            var confirmed = await _paymentRepository.GetByIdWithDetailsAsync(payment.Id);
            return confirmed!.ToResponseDto();
        }

        public async Task<IEnumerable<PaymentResponseDto>> GetMyPaymentsAsync(int userId)
        {
            var payments = await _paymentRepository.GetByUserAsync(userId);
            return payments.Select(p => p.ToResponseDto());
        }

        // Expiry is "MM/YY"; the card is valid until the last day of that month
        private static void EnsureCardNotExpired(string expiry)
        {
            var parts = expiry.Split('/');
            var month = int.Parse(parts[0]);
            var year = 2000 + int.Parse(parts[1]);
            var lastValidDay = new DateTime(year, month, DateTime.DaysInMonth(year, month));

            if (lastValidDay < DateTime.UtcNow.Date)
                throw new BadRequestException("This card has expired.");
        }
    }
}