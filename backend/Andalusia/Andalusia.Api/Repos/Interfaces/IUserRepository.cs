using Andalusia.Api.Models;

namespace Andalusia.Api.Repos.Interfaces
{
    public interface IUserRepository : IGenericRepository<User>
    {
        Task<User?> GetByEmailAsync(string email);
        Task<User?> GetByIdWithRolesAsync(int id);
        Task<bool> EmailExistsAsync(string email);
        Task<Role?> GetRoleByNameAsync(string roleName);
    }
}