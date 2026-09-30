using Andalusia.Api.Enums;

namespace Andalusia.Api.DTOs.Requests
{
    public class ProgramQueryParameters : BaseQueryParameters
    {
       
        public int? CategoryId { get; set; }
        public CatalogStatus? Status { get; set; }
        public bool? IsFeatured { get; set; }
        public decimal? MinPrice { get; set; }
        public decimal? MaxPrice { get; set; }
    }
}