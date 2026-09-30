using Andalusia.Api.DTOs.Requests;
using Andalusia.Api.Models;
using Andalusia.Api.DTOs.Responses;

namespace Andalusia.Api.Mapping
{
    public static class PartnerMapping
    {
        public static PartnerResponseDto ToResponseDto(this Partner partner)
        {
            return new PartnerResponseDto
            {
                Id = partner.Id,
                Name = partner.Name,
                LogoUrl = partner.LogoUrl,
                WebsiteUrl = partner.WebsiteUrl,
                Type = partner.Type
            };
        }

        public static Partner ToEntity(this PartnerRequestDto dto)
        {
            return new Partner
            {
                Name = dto.Name.Trim(),
                LogoUrl = dto.LogoUrl,
                WebsiteUrl = dto.WebsiteUrl,
                Type = dto.Type,
                IsActive = dto.IsActive,
                DisplayOrder = dto.DisplayOrder
            };
        }

        public static void UpdateEntity(this PartnerRequestDto dto, Partner partner)
        {
            partner.Name = dto.Name.Trim();
            partner.LogoUrl = dto.LogoUrl;
            partner.WebsiteUrl = dto.WebsiteUrl;
            partner.Type = dto.Type;
            partner.IsActive = dto.IsActive;
            partner.DisplayOrder = dto.DisplayOrder;
        }
    }
}
