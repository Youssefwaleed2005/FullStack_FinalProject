using Andalusia.Api.DTOs.Responses;
using Andalusia.Api.Models;

namespace Andalusia.Api.Mapping
{
    public static class PaymentMapping
    {
        public static PaymentResponseDto ToResponseDto(this Payment payment)
        {
            var application = payment.Application;
            var isCourse = application?.CourseId.HasValue ?? false;

            return new PaymentResponseDto
            {
                Id = payment.Id,
                ApplicationId = payment.ApplicationId,
                Amount = payment.Amount,
                Currency = payment.Currency,
                Method = payment.Method,
                Status = payment.Status,
                TransactionId = payment.TransactionId,
                CreatedAt = payment.CreatedAt,
                PaidAt = payment.PaidAt,

                TargetType = isCourse ? "Course" : "Program",
                TargetTitle = isCourse
                    ? application?.Course?.Title ?? string.Empty
                    : application?.Program?.Title ?? string.Empty,

                EnrollmentId = application?.Enrollment?.Id
            };
        }
    }
}