using Andalusia.Api.Data;
using Andalusia.Api.Enums;
using Andalusia.Api.Models;
using Andalusia.Api.Repos.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace Andalusia.Api.Repos
{
    public class AdminRepository : IAdminRepository
    {
        private readonly AppDbContext _context;

        public AdminRepository(AppDbContext context)
        {
            _context = context;
        }

        public async Task<int> CountUsersInRoleAsync(string roleName)
        {
            return await _context.Users
                .CountAsync(u => u.UserRoles.Any(ur => ur.Role.Name == roleName));
        }

        public async Task<int> CountCoursesAsync(CatalogStatus? status = null)
        {
            var query = _context.Courses.AsQueryable();
            if (status != null)
                query = query.Where(c => c.Status == status);
            return await query.CountAsync();
        }

        public async Task<int> CountProgramsAsync()
        {
            return await _context.Programs.CountAsync();
        }

        public async Task<int> CountActiveEnrollmentsAsync()
        {
            return await _context.Enrollments.CountAsync(e => e.Status == EnrollmentStatus.Active);
        }

        public async Task<int> CountPendingApplicationsAsync()
        {
            return await _context.Applications.CountAsync(a => a.Status == ApplicationStatus.Submitted);
        }

        // Total of successful payments (optionally only since a date)
        public async Task<decimal> SumPaidAsync(DateTime? from = null)
        {
            var query = _context.Payments.Where(p => p.Status == PaymentStatus.Paid);
            if (from != null)
                query = query.Where(p => p.PaidAt >= from);
            return await query.SumAsync(p => (decimal?)p.Amount) ?? 0;
        }

        // Newest first, with optional filters
        public async Task<List<Payment>> GetPaymentsAsync(PaymentStatus? status, string? search, int? take = null)
        {
            var query = _context.Payments
                .AsNoTracking()
                .Include(p => p.Application).ThenInclude(a => a.User)
                .Include(p => p.Application).ThenInclude(a => a.Course)
                .Include(p => p.Application).ThenInclude(a => a.Program)
                .AsQueryable();

            if (status != null)
                query = query.Where(p => p.Status == status);

            if (!string.IsNullOrWhiteSpace(search))
            {
                var term = search.Trim();
                query = query.Where(p =>
                    p.Application.User.FirstName.Contains(term) ||
                    p.Application.User.LastName.Contains(term) ||
                    p.Application.User.Email.Contains(term) ||
                    (p.TransactionId != null && p.TransactionId.Contains(term)));
            }

            query = query.OrderByDescending(p => p.CreatedAt);
            if (take != null)
                query = query.Take(take.Value);

            return await query.ToListAsync();
        }

        public async Task<List<User>> GetUsersAsync(string? role, string? search, bool? isActive)
        {
            var query = UsersWithDetails().AsNoTracking();

            if (!string.IsNullOrWhiteSpace(role))
                query = query.Where(u => u.UserRoles.Any(ur => ur.Role.Name == role));

            if (isActive != null)
                query = query.Where(u => u.IsActive == isActive);

            if (!string.IsNullOrWhiteSpace(search))
            {
                var term = search.Trim();
                query = query.Where(u =>
                    u.FirstName.Contains(term) ||
                    u.LastName.Contains(term) ||
                    u.Email.Contains(term));
            }

            return await query
                .OrderBy(u => u.FirstName)
                .ThenBy(u => u.LastName)
                .ToListAsync();
        }

        public async Task<User?> GetUserAsync(int id)
        {
            return await UsersWithDetails().FirstOrDefaultAsync(u => u.Id == id);
        }

        public async Task<Course?> GetCourseForUpdateAsync(int courseId)
        {
            return await _context.Courses.FirstOrDefaultAsync(c => c.Id == courseId);
        }

        public async Task SaveChangesAsync()
        {
            await _context.SaveChangesAsync();
        }

        // Users + everything AdminUserDto needs
        private IQueryable<User> UsersWithDetails()
        {
            return _context.Users
                .Include(u => u.UserRoles).ThenInclude(ur => ur.Role)
                .Include(u => u.CoursesTaught)
                .Include(u => u.Applications).ThenInclude(a => a.Enrollment);
        }
    }
}
