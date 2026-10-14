using Andalusia.Api.Models;
using Microsoft.EntityFrameworkCore.Storage;

namespace Andalusia.Api.Repos.Interfaces
{
    public interface IPaymentRepository : IGenericRepository<Payment>
    {
        Task<Payment?> GetPendingForApplicationAsync(int applicationId);
        Task<Payment?> GetByIdForConfirmAsync(int id);
        Task<Payment?> GetByIdWithDetailsAsync(int id);
        Task<IEnumerable<Payment>> GetByUserAsync(int userId);
        Task<int> CountActiveEnrollmentsAsync(int? courseId, int? programId);
        Task<IDbContextTransaction> BeginTransactionAsync();
    }
}