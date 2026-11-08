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
            var query = _context.Courses.Where(c => !c.IsDeleted);
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
            var query = PaymentsQuery(status, search);
            if (take != null)
                query = query.Take(take.Value);

            return await query.ToListAsync();
        }

        public async Task<(List<Payment> Items, int TotalCount)> GetPaymentsPageAsync(
            PaymentStatus? status, string? search, int pageNumber, int pageSize)
        {
            var query = PaymentsQuery(status, search);
            var total = await query.CountAsync();
            var items = await query.Skip((pageNumber - 1) * pageSize).Take(pageSize).ToListAsync();
            return (items, total);
        }

        // Sum of paid payments in each query result, for the payments page header
        public async Task<decimal> SumPaidAsync(PaymentStatus? status, string? search)
        {
            return await PaymentsQuery(status, search)
                .Where(p => p.Status == PaymentStatus.Paid)
                .SumAsync(p => (decimal?)p.Amount) ?? 0;
        }

        private IQueryable<Payment> PaymentsQuery(PaymentStatus? status, string? search)
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

            return query.OrderByDescending(p => p.CreatedAt);
        }

        // ---------- Chart data for the admin overview ----------

        public async Task<List<Payment>> GetPaidPaymentsSinceAsync(DateTime from)
        {
            return await _context.Payments
                .AsNoTracking()
                .Where(p => p.Status == PaymentStatus.Paid && p.PaidAt >= from)
                .ToListAsync();
        }

        // One category name per enrollment (from its course, or from its program)
        public async Task<List<string>> GetEnrollmentCategoryNamesAsync()
        {
            return await _context.Enrollments
                .AsNoTracking()
                .Select(e => e.Application.Course != null
                    ? e.Application.Course.Category.Name
                    : e.Application.Program != null ? e.Application.Program.Category.Name : "Other")
                .ToListAsync();
        }

        public async Task<List<User>> GetUsersAsync(string? role, string? search, bool? isActive)
        {
            return await UsersQuery(role, search, isActive).ToListAsync();
        }

        public async Task<(List<User> Items, int TotalCount)> GetUsersPageAsync(
            string? role, string? search, bool? isActive, int pageNumber, int pageSize)
        {
            var query = UsersQuery(role, search, isActive);
            var total = await query.CountAsync();
            var items = await query.Skip((pageNumber - 1) * pageSize).Take(pageSize).ToListAsync();
            return (items, total);
        }

        private IQueryable<User> UsersQuery(string? role, string? search, bool? isActive)
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

            return query
                .OrderBy(u => u.FirstName)
                .ThenBy(u => u.LastName);
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

        // Every course, drafts included (the public list hides drafts)
        public async Task<List<Course>> GetAllCoursesAsync()
        {
            // Archived courses are included (shown with a Restore button), at the end of the list
            return await _context.Courses
                .AsNoTracking()
                .Include(c => c.Category)
                .Include(c => c.Instructor)
                .Include(c => c.Reviews)
                .OrderBy(c => c.IsDeleted)
                .ThenBy(c => c.Title)
                .ToListAsync();
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
