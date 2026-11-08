using System.ComponentModel.DataAnnotations;
using Andalusia.Api.Enums;

namespace Andalusia.Api.Models
{
    public class Partner
    {
        public int Id { get; set; }

        [Required]
        [MaxLength(150)]
        public string Name { get; set; } = string.Empty;

        [MaxLength(300)]
        public string? LogoUrl { get; set; }

        [MaxLength(300)]
        public string? WebsiteUrl { get; set; }

        public PartnerType Type { get; set; } = PartnerType.Partner;

        public bool IsActive { get; set; } = true;

        public int DisplayOrder { get; set; }

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        // Soft delete: hidden everywhere (global query filter), but the row is kept
        public bool IsDeleted { get; set; }
        public DateTime? DeletedAt { get; set; }
    }
}