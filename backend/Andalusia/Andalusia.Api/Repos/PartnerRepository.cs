using Andalusia.Api.Data;
using Andalusia.Api.Enums;
using Andalusia.Api.Models;
using Andalusia.Api.Repos.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace Andalusia.Api.Repos
{
    public class PartnerRepository : GenericRepository<Partner>, IPartnerRepository
    {
        public PartnerRepository(AppDbContext context) : base(context) { }

        public async Task<IEnumerable<Partner>> GetActiveAsync(PartnerType? type, int? take)
        {
            IQueryable<Partner> partners = _dbSet
                .AsNoTracking()
                .Where(p => p.IsActive);

            if (type.HasValue)
                partners = partners.Where(p => p.Type == type.Value);

            partners = partners
                .OrderBy(p => p.DisplayOrder)
                .ThenBy(p => p.Name);

            if (take.HasValue && take.Value > 0)
                partners = partners.Take(take.Value);

            return await partners.ToListAsync();
        }
    }
}