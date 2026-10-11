using Andalusia.Api.DTOs.Requests;
using Andalusia.Api.DTOs.Responses;
using Andalusia.Api.Models;

namespace Andalusia.Api.Mapping
{
    public static class UserMapping
    {
        // User → UserSummaryDto (embedded in the auth response)
        public static UserSummaryDto ToSummaryDto(this User user)
        {
            return new UserSummaryDto
            {
                Id = user.Id,
                FirstName = user.FirstName,
                LastName = user.LastName,
                Email = user.Email,
                Roles = user.UserRoles.Select(ur => ur.Role.Name).ToList()
            };
        }

        // User → UserProfileResponseDto (GET /api/auth/me)
        public static UserProfileResponseDto ToProfileDto(this User user)
        {
            return new UserProfileResponseDto
            {
                Id = user.Id,
                FirstName = user.FirstName,
                LastName = user.LastName,
                Email = user.Email,
                PhoneNumber = user.PhoneNumber,
                Country = user.Country,
                PreferredLanguage = user.PreferredLanguage,
                CreatedAt = user.CreatedAt,
                Roles = user.UserRoles.Select(ur => ur.Role.Name).ToList()
            };
        }

        // RegisterRequestDto → new User (PasswordHash set by the service)
        public static User ToEntity(this RegisterRequestDto dto)
        {
            return new User
            {
                FirstName = dto.FirstName.Trim(),
                LastName = dto.LastName.Trim(),
                Email = dto.Email.Trim().ToLower(),
                PhoneNumber = dto.PhoneNumber,
                Country = dto.Country,
                PreferredLanguage = dto.PreferredLanguage,
                TermsAcceptedAt = DateTime.UtcNow
            };
        }

        public static void UpdateEntity(this UpdateProfileRequestDto dto, User user)
        {
            user.FirstName = dto.FirstName.Trim();
            user.LastName = dto.LastName.Trim();
            user.PhoneNumber = dto.PhoneNumber;
            user.Country = dto.Country;
            user.PreferredLanguage = dto.PreferredLanguage;
        }
    }
}