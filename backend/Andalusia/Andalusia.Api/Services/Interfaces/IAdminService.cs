using Andalusia.Api.DTOs.Requests;
using Andalusia.Api.DTOs.Responses;
using Andalusia.Api.Enums;

namespace Andalusia.Api.Services.Interfaces
{
    public interface IAdminService
    {
        Task<AdminDashboardDto> GetDashboardAsync();
        Task<List<AdminPaymentDto>> GetPaymentsAsync(PaymentStatus? status, string? search);

        Task<List<AdminUserDto>> GetUsersAsync(string? role, string? search, bool? isActive);
        Task<AdminUserDto> GetUserAsync(int id);
        Task<AdminUserDto> SetUserStatusAsync(int adminId, int userId, bool isActive);
        Task<AdminUserDto> CreateInstructorAsync(CreateInstructorRequestDto dto);
        Task AssignInstructorAsync(int courseId, int instructorId);
        Task<List<CourseResponseDto>> GetAllCoursesAsync();
    }
}