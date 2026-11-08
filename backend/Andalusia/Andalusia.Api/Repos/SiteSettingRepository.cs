using Andalusia.Api.Data;
using Andalusia.Api.Models;
using Andalusia.Api.Repos.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace Andalusia.Api.Repos
{
    public class SiteSettingRepository : GenericRepository<SiteSetting>, ISiteSettingRepository
    {
        public SiteSettingRepository(AppDbContext context) : base(context) { }

        public async Task<string?> GetUserFullNameAsync(int userId)
        {
            return await _context.Users
                .Where(u => u.Id == userId)
                .Select(u => u.FirstName + " " + u.LastName)
                .FirstOrDefaultAsync();
        }

        // The most recently saved setting (for "last edited by …")
        public async Task<SiteSetting?> GetLastEditedAsync()
        {
            return await _dbSet.AsNoTracking().OrderByDescending(s => s.UpdatedAt).FirstOrDefaultAsync();
        }
    }
}
