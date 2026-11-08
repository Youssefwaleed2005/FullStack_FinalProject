using System.ComponentModel.DataAnnotations;

namespace Andalusia.Api.DTOs.Requests
{
    // multipart/form-data: the user's profile photo
    public class UploadPhotoRequestDto
    {
        [Required]
        public IFormFile File { get; set; } = null!;
    }
}
