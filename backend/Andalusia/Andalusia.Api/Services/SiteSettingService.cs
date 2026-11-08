using System.ComponentModel.DataAnnotations;
using Andalusia.Api.DTOs.Requests;
using Andalusia.Api.DTOs.Responses;
using Andalusia.Api.Exceptions;
using Andalusia.Api.Models;
using Andalusia.Api.Repos.Interfaces;
using Andalusia.Api.Services.Interfaces;

namespace Andalusia.Api.Services
{
    public class SiteSettingService : ISiteSettingService
    {
        // The only keys that can be saved, with their max length
        private static readonly Dictionary<string, int> AllowedKeys = new()
        {
            ["contact.email"] = 150,
            ["contact.phone"] = 40,
            ["contact.address"] = 200,
            ["social.facebook"] = 300,
            ["social.instagram"] = 300,
            ["social.linkedin"] = 300,
            ["social.youtube"] = 300,
            ["site.description"] = 300,
            ["about.mission"] = 1000,
            ["about.story"] = 1500,
        };

        private static readonly EmailAddressAttribute EmailCheck = new();

        private readonly ISiteSettingRepository _repo;

        public SiteSettingService(ISiteSettingRepository repo)
        {
            _repo = repo;
        }

        public async Task<Dictionary<string, string>> GetAllAsync()
        {
            var settings = await _repo.GetAllAsync();
            return settings.ToDictionary(s => s.Key, s => s.Value);
        }

        public async Task<LastEditDto> GetLastEditAsync()
        {
            var last = await _repo.GetLastEditedAsync();
            return new LastEditDto { UpdatedAt = last?.UpdatedAt, UpdatedBy = last?.UpdatedBy };
        }

        public async Task<Dictionary<string, string>> UpdateAsync(SiteSettingsUpdateDto dto, int actorId)
        {
            var actor = await _repo.GetUserFullNameAsync(actorId);
            // Check everything first, so a bad value means nothing is saved
            var values = new Dictionary<string, string>();
            foreach (var (key, rawValue) in dto.Values)
            {
                var value = rawValue?.Trim() ?? string.Empty;
                Validate(key, value);
                values[key] = value;
            }

            var existing = (await _repo.GetAllAsync()).ToDictionary(s => s.Key);
            foreach (var (key, value) in values)
            {
                if (existing.TryGetValue(key, out var setting))
                {
                    setting.Value = value;
                    setting.UpdatedAt = DateTime.UtcNow;
                    setting.UpdatedBy = actor;
                }
                else
                {
                    await _repo.AddAsync(new SiteSetting { Key = key, Value = value, UpdatedBy = actor });
                }
            }
            await _repo.SaveChangesAsync();

            return await GetAllAsync();
        }

        private static void Validate(string key, string value)
        {
            if (!AllowedKeys.TryGetValue(key, out var maxLength))
                throw new BadRequestException($"Unknown setting '{key}'");

            // Empty = hidden, always allowed
            if (value.Length == 0)
                return;

            if (value.Length > maxLength)
                throw new BadRequestException($"'{key}' can be at most {maxLength} characters");

            if (key == "contact.email" && !EmailCheck.IsValid(value))
                throw new BadRequestException("contact.email must be a valid email address");

            if (key.StartsWith("social.") && !IsHttpUrl(value))
                throw new BadRequestException($"'{key}' must be a full http(s) link");
        }

        private static bool IsHttpUrl(string value)
        {
            return Uri.TryCreate(value, UriKind.Absolute, out var uri)
                && (uri.Scheme == Uri.UriSchemeHttp || uri.Scheme == Uri.UriSchemeHttps);
        }
    }
}
