using Andalusia.Api.DTOs.Requests;
using Andalusia.Api.DTOs.Responses;

namespace Andalusia.Api.Services.Interfaces
{
    public interface IAuthService
    {
        Task<AuthResponseDto> RegisterAsync(RegisterRequestDto dto);
        Task<AuthResponseDto> LoginAsync(LoginRequestDto dto);
        Task<UserProfileResponseDto> GetProfileAsync(int userId);
        Task<UserProfileResponseDto> UpdateProfileAsync(int userId, UpdateProfileRequestDto dto);
        Task ChangePasswordAsync(int userId, ChangePasswordRequestDto dto);
        Task<ForgotPasswordResponseDto> ForgotPasswordAsync(ForgotPasswordRequestDto dto, string resetPageUrl);
        Task ResetPasswordAsync(ResetPasswordRequestDto dto);
        Task<UserProfileResponseDto> UploadPhotoAsync(int userId, IFormFile file);
    }
}