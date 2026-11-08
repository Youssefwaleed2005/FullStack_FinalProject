using System.ComponentModel.DataAnnotations;

namespace Andalusia.Api.DTOs.Requests
{
    // Paging for the admin lists (users, payments)
    public class AdminListQuery
    {
        [Range(1, int.MaxValue, ErrorMessage = "Page number must be 1 or more.")]
        public int PageNumber { get; set; } = 1;

        [Range(1, 100, ErrorMessage = "Page size must be between 1 and 100.")]
        public int PageSize { get; set; } = 10;
    }
}
