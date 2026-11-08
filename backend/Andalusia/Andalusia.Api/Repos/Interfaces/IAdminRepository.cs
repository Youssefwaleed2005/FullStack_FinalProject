using Andalusia.Api.Enums;
using Andalusia.Api.Models;

namespace Andalusia.Api.Repos.Interfaces
{
    public interface IAdminRepository
    {
        Task<int> CountUsersInRoleAsync(string roleName);
        Task<int> CountCoursesAsync(CatalogStatus? status = null);
        Task<int> CountProgramsAsync();
        Task<int> CountActiveEnrollmentsAsync();
        Task<int> CountPendingApplicationsAsync();
        Task<decimal> SumPaidAsync(DateTime? from = null);

        Task<List<Payment>> GetPaymentsAsync(PaymentStatus? status, string? search, int? take = null);
        Task<(List<Payment> Items, int TotalCount)> GetPaymentsPageAsync(PaymentStatus? status, string? search, int pageNumber, int pageSize);
        Task<decimal> SumPaidAsync(PaymentStatus? status, string? search);
        Task<List<Payment>> GetPaidPaymentsSinceAsync(DateTime from);
        Task<List<string>> GetEnrollmentCategoryNamesAsync();

        Task<List<User>> GetUsersAsync(string? role, string? search, bool? isActive);
        Task<(List<User> Items, int TotalCount)> GetUsersPageAsync(string? role, string? search, bool? isActive, int pageNumber, int pageSize);
        Task<User?> GetUserAsync(int id);              // tracked (for updates)
        Task<Course?> GetCourseForUpdateAsync(int courseId);
        Task<List<Course>> GetAllCoursesAsync();
        Task SaveChangesAsync();
    }
}