using System.ComponentModel.DataAnnotations;

namespace Andalusia.Api.DTOs.Requests
{
    // POST /api/auth/reset-password (token from the reset link)
    public class ResetPasswordRequestDto
    {
        [Required, EmailAddress]
        public string Email { get; set; } = string.Empty;

        [Required]
        public string Token { get; set; } = string.Empty;

        [Required, MinLength(8, ErrorMessage = "The new password must be at least 8 characters.")]
        public string NewPassword { get; set; } = string.Empty;

        [Required, Compare(nameof(NewPassword), ErrorMessage = "Passwords do not match.")]
        public string ConfirmPassword { get; set; } = string.Empty;
    }
}
