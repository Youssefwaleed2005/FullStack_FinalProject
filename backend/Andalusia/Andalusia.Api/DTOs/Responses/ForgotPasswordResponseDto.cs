namespace Andalusia.Api.DTOs.Responses
{
    public class ForgotPasswordResponseDto
    {
        // Always the same message, so nobody can find out which emails are registered
        public string Message { get; set; } = string.Empty;

        // Development only: there is no email service, so the reset link is returned (and logged) for the demo
        public string? DevResetLink { get; set; }
    }
}
