using Andalusia.Api.Models;

namespace Andalusia.Api.Repos.Interfaces
{
    public interface ITestimonialRepository : IGenericRepository<Testimonial>
    {
        Task<IEnumerable<Testimonial>> GetPublishedAsync(int? take = null);
    }
}