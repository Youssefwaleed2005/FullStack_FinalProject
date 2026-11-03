using System.ComponentModel.DataAnnotations;

namespace Andalusia.Api.Models
{
    // One editable piece of site content (footer, About, Contact), e.g. "contact.email"
    public class SiteSetting
    {
        public int Id { get; set; }

        [Required]
        [MaxLength(100)]
        public string Key { get; set; } = string.Empty;

        // "" means the item is hidden on the website
        [MaxLength(2000)]
        public string Value { get; set; } = string.Empty;

        public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;
    }
}
