using System.ComponentModel.DataAnnotations;

namespace Andalusia.Api.DTOs.Requests
{
    public class SiteSettingsUpdateDto
    {
        // Key → new value. Only the keys sent are changed; null or "" hides the item.
        [Required]
        public Dictionary<string, string?> Values { get; set; } = new();
    }
}
