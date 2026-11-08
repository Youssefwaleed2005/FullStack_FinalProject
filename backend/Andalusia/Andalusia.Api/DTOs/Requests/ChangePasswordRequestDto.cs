using System.ComponentModel.DataAnnotations;

namespace Andalusia.Api.DTOs.Requests
{
    // PUT /api/auth/change-password
    public class ChangePasswordRequestDto
    {
        [Required]
        public string CurrentPassword { get; set; } = string.Empty;

        [Required, MinLength(8, ErrorMessage = "The new password must be at least 8 characters.")]
        public string NewPassword { get; set; } = string.Empty;

        [Required, Compare(nameof(NewPassword), ErrorMessage = "Passwords do not match.")]
        public string ConfirmPassword { get; set; } = string.Empty;
    }
}
