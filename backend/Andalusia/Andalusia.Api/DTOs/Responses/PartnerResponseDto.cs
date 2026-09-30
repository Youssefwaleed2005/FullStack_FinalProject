using Andalusia.Api.Enums;

namespace Andalusia.Api.DTOs.Responses
{
    public class PartnerResponseDto
    {
        public int Id { get; set; }
        public string Name { get; set; } = string.Empty;
        public string? LogoUrl { get; set; }
        public string? WebsiteUrl { get; set; }
        public PartnerType Type { get; set; }
    }
}