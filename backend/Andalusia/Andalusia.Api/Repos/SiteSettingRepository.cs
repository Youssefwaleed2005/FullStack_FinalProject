using Andalusia.Api.Data;
using Andalusia.Api.Models;
using Andalusia.Api.Repos.Interfaces;

namespace Andalusia.Api.Repos
{
    public class SiteSettingRepository : GenericRepository<SiteSetting>, ISiteSettingRepository
    {
        public SiteSettingRepository(AppDbContext context) : base(context) { }
    }
}
