using Andalusia.Api.Data;
using Andalusia.Api.Models;
using Andalusia.Api.Repos.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace Andalusia.Api.Repos
{
    public class TestimonialRepository : GenericRepository<Testimonial>, ITestimonialRepository
    {
        public TestimonialRepository(AppDbContext context) : base(context) { }

        public async Task<IEnumerable<Testimonial>> GetPublishedAsync(int? take = null)
        {
            IQueryable<Testimonial> testimonials = _dbSet
                .AsNoTracking()
                .Where(t => t.IsPublished)
                .OrderByDescending(t => t.CreatedAt);

            if (take.HasValue && take.Value > 0)
                testimonials = testimonials.Take(take.Value);

            return await testimonials.ToListAsync();
        }
    }
}