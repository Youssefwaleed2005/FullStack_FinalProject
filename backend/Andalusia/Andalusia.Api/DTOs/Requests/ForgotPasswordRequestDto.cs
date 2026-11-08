using System.ComponentModel.DataAnnotations;

namespace Andalusia.Api.DTOs.Requests
{
    // POST /api/auth/forgot-password
    public class ForgotPasswordRequestDto
    {
        [Required, EmailAddress]
        public string Email { get; set; } = string.Empty;
    }
}
