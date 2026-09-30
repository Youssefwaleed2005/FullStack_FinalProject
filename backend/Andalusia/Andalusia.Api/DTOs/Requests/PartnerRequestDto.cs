using Andalusia.Api.Enums;
using System.ComponentModel.DataAnnotations;

namespace Andalusia.Api.DTOs.Requests
{
    public class PartnerRequestDto
    {
        [Required, MaxLength(150)]
        public string Name { get; set; } = string.Empty;

        [MaxLength(300), Url]
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
