using Andalusia.Api.Enums;

namespace Andalusia.Api.DTOs.Responses
{
    public class PartnerAdminResponseDto
    {
        public int Id { get; set; }
        public string Name { get; set; } = string.Empty;
        public string? LogoUrl { get; set; }
        public string? WebsiteUrl { get; set; }
        public PartnerType Type { get; set; }
        public bool IsActive { get; set; }
        public int DisplayOrder { get; set; }
    }
}