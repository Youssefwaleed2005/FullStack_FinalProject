using Andalusia.Api.Models;
using Microsoft.EntityFrameworkCore;

namespace Andalusia.Api.Data
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

        public DbSet<Category> Categories { get; set; }
        public DbSet<Course> Courses { get; set; }
        public DbSet<AcademyProgram> Programs { get; set; }
        public DbSet<CareerPath> CareerPaths { get; set; }
        public DbSet<Application> Applications { get; set; }
        public DbSet<Payment> Payments { get; set; }
        public DbSet<Enrollment> Enrollments { get; set; }
        public DbSet<Partner> Partners { get; set; }
        public DbSet<Testimonial> Testimonials { get; set; }
        public DbSet<Permission> Permissions { get; set; }
        public DbSet<User> Users { get; set; }
        public DbSet<Role> Roles { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);
        }
    }
}