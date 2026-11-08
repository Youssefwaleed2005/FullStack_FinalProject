namespace Andalusia.Api.DTOs.Responses
{
    // Where an uploaded file can be found, e.g. "/uploads/partners/3f2a....png"
    public class UploadedFileDto
    {
        public string Url { get; set; } = string.Empty;
    }
}
