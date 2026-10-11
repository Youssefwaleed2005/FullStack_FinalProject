using System.Security.Claims;
using Andalusia.Api.Exceptions;

namespace Andalusia.Api.Helpers
{
    public static class ClaimsPrincipalExtensions
    {
        public static int GetUserId(this ClaimsPrincipal principal)
        {
            var value = principal.FindFirstValue(ClaimTypes.NameIdentifier);

            return int.TryParse(value, out var id)
                ? id
                : throw new UnauthorizedException("Invalid or missing user identity in token.");
        }
    }
}