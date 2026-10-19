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

        Task<List<User>> GetUsersAsync(string? role, string? search, bool? isActive);
        Task<User?> GetUserAsync(int id);              // tracked (for updates)
        Task<Course?> GetCourseForUpdateAsync(int courseId);
        Task SaveChangesAsync();
    }
}