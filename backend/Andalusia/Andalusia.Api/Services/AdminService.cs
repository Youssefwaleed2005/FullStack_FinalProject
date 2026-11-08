using Andalusia.Api.DTOs.Requests;
using Andalusia.Api.DTOs.Responses;
using Andalusia.Api.Enums;
using Andalusia.Api.Exceptions;
using Andalusia.Api.Helpers;
using Andalusia.Api.Mapping;
using Andalusia.Api.Models;
using Andalusia.Api.Repos.Interfaces;
using Andalusia.Api.Services.Interfaces;

namespace Andalusia.Api.Services
{
    public class AdminService : IAdminService
    {
        private readonly IAdminRepository _adminRepository;
        private readonly IUserRepository _userRepository;

        public AdminService(IAdminRepository adminRepository, IUserRepository userRepository)
        {
            _adminRepository = adminRepository;
            _userRepository = userRepository;
        }

        public async Task<AdminDashboardDto> GetDashboardAsync()
        {
            var now = DateTime.UtcNow;
            var monthStart = new DateTime(now.Year, now.Month, 1, 0, 0, 0, DateTimeKind.Utc);

            var recent = await _adminRepository.GetPaymentsAsync(null, null, take: 5);

            return new AdminDashboardDto
            {
                LearnerCount = await _adminRepository.CountUsersInRoleAsync(Roles.Learner),
                InstructorCount = await _adminRepository.CountUsersInRoleAsync(Roles.Instructor),
                CourseCount = await _adminRepository.CountCoursesAsync(),
                OpenCourseCount = await _adminRepository.CountCoursesAsync(CatalogStatus.OpenForEnrollment),
                ProgramCount = await _adminRepository.CountProgramsAsync(),
                ActiveEnrollmentCount = await _adminRepository.CountActiveEnrollmentsAsync(),
                PendingApplicationCount = await _adminRepository.CountPendingApplicationsAsync(),
                TotalRevenue = await _adminRepository.SumPaidAsync(),
                RevenueThisMonth = await _adminRepository.SumPaidAsync(monthStart),
                RecentPayments = recent.Select(p => p.ToAdminDto()).ToList()
            };
        }

        public async Task<AdminPaymentsPageDto> GetPaymentsPageAsync(PaymentStatus? status, string? search, AdminListQuery page)
        {
            var (items, total) = await _adminRepository.GetPaymentsPageAsync(status, search, page.PageNumber, page.PageSize);
            return new AdminPaymentsPageDto
            {
                Items = items.Select(p => p.ToAdminDto()).ToList(),
                PageNumber = page.PageNumber,
                PageSize = page.PageSize,
                TotalCount = total,
                PaidTotal = await _adminRepository.SumPaidAsync(status, search)
            };
        }

        public async Task<PagedResponse<AdminUserDto>> GetUsersPageAsync(string? role, string? search, bool? isActive, AdminListQuery page)
        {
            var (items, total) = await _adminRepository.GetUsersPageAsync(role, search, isActive, page.PageNumber, page.PageSize);
            return new PagedResponse<AdminUserDto>
            {
                Items = items.Select(u => u.ToAdminDto()).ToList(),
                PageNumber = page.PageNumber,
                PageSize = page.PageSize,
                TotalCount = total
            };
        }

        public async Task<AdminStatsDto> GetStatsAsync()
        {
            var now = DateTime.UtcNow;
            var firstMonth = new DateTime(now.Year, now.Month, 1, 0, 0, 0, DateTimeKind.Utc).AddMonths(-5);
            var paid = await _adminRepository.GetPaidPaymentsSinceAsync(firstMonth);

            var months = Enumerable.Range(0, 6).Select(i => firstMonth.AddMonths(i)).ToList();
            var revenue = months.Select(month =>
            {
                var inMonth = paid.Where(p => p.PaidAt.HasValue
                    && p.PaidAt.Value.Year == month.Year && p.PaidAt.Value.Month == month.Month).ToList();
                return new MonthlyRevenueDto
                {
                    Month = month.ToString("MMM yyyy"),
                    Revenue = inMonth.Sum(p => p.Amount),
                    Payments = inMonth.Count
                };
            }).ToList();

            var categories = (await _adminRepository.GetEnrollmentCategoryNamesAsync())
                .GroupBy(name => name)
                .Select(g => new CategoryCountDto { Category = g.Key, Count = g.Count() })
                .OrderByDescending(c => c.Count)
                .ToList();

            return new AdminStatsDto { RevenueByMonth = revenue, EnrollmentsByCategory = categories };
        }

        public async Task<List<AdminPaymentDto>> GetPaymentsAsync(PaymentStatus? status, string? search)
        {
            var payments = await _adminRepository.GetPaymentsAsync(status, search);
            return payments.Select(p => p.ToAdminDto()).ToList();
        }

        public async Task<List<AdminUserDto>> GetUsersAsync(string? role, string? search, bool? isActive)
        {
            var users = await _adminRepository.GetUsersAsync(role, search, isActive);
            return users.Select(u => u.ToAdminDto()).ToList();
        }

        public async Task<AdminUserDto> GetUserAsync(int id)
        {
            var user = await _adminRepository.GetUserAsync(id)
                ?? throw new NotFoundException($"User with id {id} was not found.");
            return user.ToAdminDto();
        }

        public async Task<AdminUserDto> SetUserStatusAsync(int adminId, int userId, bool isActive)
        {
            // Guard: an admin can't lock themselves out
            if (adminId == userId && !isActive)
                throw new BadRequestException("You cannot deactivate your own account.");

            var user = await _adminRepository.GetUserAsync(userId)
                ?? throw new NotFoundException($"User with id {userId} was not found.");

            user.IsActive = isActive;
            await _adminRepository.SaveChangesAsync();

            return user.ToAdminDto();
        }

        public async Task<AdminUserDto> CreateInstructorAsync(CreateInstructorRequestDto dto)
        {
            var email = dto.Email.Trim();

            if (await _userRepository.EmailExistsAsync(email))
                throw new ConflictException("An account with this email already exists.");

            var instructorRole = await _userRepository.GetRoleByNameAsync(Roles.Instructor)
                ?? throw new NotFoundException("The 'Instructor' role is missing. Seed the database first.");

            var user = new User
            {
                FirstName = dto.FirstName.Trim(),
                LastName = dto.LastName.Trim(),
                Email = email,
                PasswordHash = BCrypt.Net.BCrypt.HashPassword(dto.Password),
                PhoneNumber = dto.PhoneNumber,
                Specialization = dto.Specialization,
                Bio = dto.Bio,
                EmailConfirmed = true
            };
            user.UserRoles.Add(new UserRole { Role = instructorRole });

            await _userRepository.AddAsync(user);
            await _userRepository.SaveChangesAsync();

            var created = await _adminRepository.GetUserAsync(user.Id);
            return created!.ToAdminDto();
        }

        public async Task AssignInstructorAsync(int courseId, int instructorId)
        {
            var course = await _adminRepository.GetCourseForUpdateAsync(courseId)
                ?? throw new NotFoundException($"Course with id {courseId} was not found.");

            var instructor = await _adminRepository.GetUserAsync(instructorId)
                ?? throw new NotFoundException($"User with id {instructorId} was not found.");

            // Guard: must be an active instructor
            if (!instructor.UserRoles.Any(ur => ur.Role.Name == Roles.Instructor))
                throw new BadRequestException("This user is not an instructor.");
            if (!instructor.IsActive)
                throw new BadRequestException("This instructor's account is deactivated.");

            course.InstructorId = instructorId;
            await _adminRepository.SaveChangesAsync();
        }

        public async Task<List<CourseResponseDto>> GetAllCoursesAsync()
        {
            var courses = await _adminRepository.GetAllCoursesAsync();
            return courses.Select(c => c.ToResponseDto()).ToList();
        }
    }
}
