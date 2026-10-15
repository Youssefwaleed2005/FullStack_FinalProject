using Andalusia.Api.Data;
using Andalusia.Api.Enums;
using Andalusia.Api.Models;
using Andalusia.Api.Repos.Interfaces;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Storage;

namespace Andalusia.Api.Repos
{
    public class PaymentRepository : GenericRepository<Payment>, IPaymentRepository
    {
        public PaymentRepository(AppDbContext context) : base(context) { }

        public async Task<Payment?> GetPendingForApplicationAsync(int applicationId)
        {
            return await _dbSet
                .AsNoTracking()
                .Include(p => p.Application).ThenInclude(a => a.Course)
                .Include(p => p.Application).ThenInclude(a => a.Program)
                .FirstOrDefaultAsync(p => p.ApplicationId == applicationId
                                       && p.Status == PaymentStatus.Pending);
        }

        // Other pending payments for the same application (tracked, so we can update them)
        public async Task<List<Payment>> GetOtherPendingAsync(int applicationId, int exceptPaymentId)
        {
            return await _dbSet
                .Where(p => p.ApplicationId == applicationId
                         && p.Id != exceptPaymentId
                         && p.Status == PaymentStatus.Pending)
                .ToListAsync();
        }

        public async Task<Payment?> GetByIdForConfirmAsync(int id)
        {
            // Tracked (no AsNoTracking): confirm changes the payment and its application
            return await _dbSet
                .Include(p => p.Application).ThenInclude(a => a.Course)
                .Include(p => p.Application).ThenInclude(a => a.Program)
                .Include(p => p.Application).ThenInclude(a => a.Enrollment)
                .FirstOrDefaultAsync(p => p.Id == id);
        }

        public async Task<Payment?> GetByIdWithDetailsAsync(int id)
        {
            return await _dbSet
                .AsNoTracking()
                .Include(p => p.Application).ThenInclude(a => a.Course)
                .Include(p => p.Application).ThenInclude(a => a.Program)
                .Include(p => p.Application).ThenInclude(a => a.Enrollment)
                .FirstOrDefaultAsync(p => p.Id == id);
        }

        public async Task<IEnumerable<Payment>> GetByUserAsync(int userId)
        {
            return await _dbSet
                .AsNoTracking()
                .Include(p => p.Application).ThenInclude(a => a.Course)
                .Include(p => p.Application).ThenInclude(a => a.Program)
                .Include(p => p.Application).ThenInclude(a => a.Enrollment)
                .Where(p => p.Application.UserId == userId)
                .OrderByDescending(p => p.CreatedAt)
                .ToListAsync();
        }

        public async Task<int> CountActiveEnrollmentsAsync(int? courseId, int? programId)
        {
            var enrollments = _context.Enrollments.Where(e => e.Status == EnrollmentStatus.Active);

            if (courseId.HasValue)
                return await enrollments.CountAsync(e => e.Application.CourseId == courseId.Value);

            return await enrollments.CountAsync(e => e.Application.ProgramId == programId);
        }

        public async Task<IDbContextTransaction> BeginTransactionAsync()
        {
            return await _context.Database.BeginTransactionAsync();
        }
    }
}