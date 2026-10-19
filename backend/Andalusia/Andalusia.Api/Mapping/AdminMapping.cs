using Andalusia.Api.DTOs.Responses;
using Andalusia.Api.Enums;
using Andalusia.Api.Models;

namespace Andalusia.Api.Mapping
{
    public static class AdminMapping
    {
        // Payment (with Application.User/Course/Program loaded) → AdminPaymentDto
        public static AdminPaymentDto ToAdminDto(this Payment payment)
        {
            var application = payment.Application;
            var user = application.User;

            return new AdminPaymentDto
            {
                Id = payment.Id,
                Amount = payment.Amount,
                Currency = payment.Currency,
                Method = payment.Method,
                Status = payment.Status,
                TransactionId = payment.TransactionId,
                CreatedAt = payment.CreatedAt,
                PaidAt = payment.PaidAt,
                UserId = user.Id,
                StudentName = $"{user.FirstName} {user.LastName}",
                StudentEmail = user.Email,
                TargetType = application.CourseId != null ? "Course" : "Program",
                TargetTitle = application.Course?.Title ?? application.Program?.Title ?? string.Empty
            };
        }

        // User (with UserRoles.Role, CoursesTaught, Applications.Enrollment loaded) → AdminUserDto
        public static AdminUserDto ToAdminDto(this User user)
        {
            return new AdminUserDto
            {
                Id = user.Id,
                FirstName = user.FirstName,
                LastName = user.LastName,
                FullName = $"{user.FirstName} {user.LastName}",
                Email = user.Email,
                PhoneNumber = user.PhoneNumber,
                Country = user.Country,
                Specialization = user.Specialization,
                Roles = user.UserRoles.Select(ur => ur.Role.Name).ToList(),
                IsActive = user.IsActive,
                CreatedAt = user.CreatedAt,
                ActiveEnrollments = user.Applications.Count(a =>
                    a.Enrollment != null && a.Enrollment.Status == EnrollmentStatus.Active),
                CoursesTaught = user.CoursesTaught.Count
            };
        }
    }
}