using Andalusia.Api.Enums;
using System.ComponentModel.DataAnnotations;

namespace Andalusia.Api.DTOs.Requests
{
    public class PartnerRequestDto
    {
        [Required, MaxLength(150)]
        public string Name { get; set; } = string.Empty;

        // A full http(s) link, or a file on our API such as "/files/partners/logo.svg"
        [MaxLength(300)]
        [RegularExpression(@"^(https?://\S+|/(files|uploads)/\S+)$", ErrorMessage = "Logo must be an http(s) link or a /files/ or /uploads/ path.")]
        public string? LogoUrl { get; set; }

        [MaxLength(300), Url]
        public string? WebsiteUrl { get; set; }

        [EnumDataType(typeof(PartnerType))]
        public PartnerType Type { get; set; } = PartnerType.Partner;

        public bool IsActive { get; set; } = true;

        [Range(0, int.MaxValue)]
        public int DisplayOrder { get; set; }
    }
}
