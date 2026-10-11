using Andalusia.Api.Models;

namespace Andalusia.Api.Services.Interfaces
{
    public interface ITokenService
    {
        (string Token, DateTime ExpiresAt) CreateToken(User user, IEnumerable<string> roles);
    }
}