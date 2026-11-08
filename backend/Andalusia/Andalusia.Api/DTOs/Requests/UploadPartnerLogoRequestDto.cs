using System.ComponentModel.DataAnnotations;

namespace Andalusia.Api.DTOs.Requests
{
    // multipart/form-data: the logo image of a partner
    public class UploadPartnerLogoRequestDto
    {
        [Required]
        public IFormFile File { get; set; } = null!;
    }
}
