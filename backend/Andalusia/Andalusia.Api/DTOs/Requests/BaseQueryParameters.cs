using System.ComponentModel.DataAnnotations;

namespace Andalusia.Api.DTOs.Requests
{
    public class BaseQueryParameters
    {
        
        public string? Search { get; set; }

        
        public string? SortBy { get; set; }
        public bool SortDescending { get; set; }

       
        [Range(1, int.MaxValue, ErrorMessage = "Page number must be 1 or more.")]
        public int PageNumber { get; set; } = 1;

        [Range(1, 50, ErrorMessage = "Page size must be between 1 and 50.")]
        public int PageSize { get; set; } = 9;
    }
}