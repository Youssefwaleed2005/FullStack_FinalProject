using Andalusia.Api.Enums;
using Andalusia.Api.Models;
using Microsoft.EntityFrameworkCore;

namespace Andalusia.Api.Data
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

        //one DbSet = one table
        public DbSet<Category> Categories { get; set; }
        public DbSet<Course> Courses { get; set; }
        public DbSet<AcademyProgram> Programs { get; set; }
        public DbSet<ProgramCourse> ProgramCourses { get; set; }
        public DbSet<CareerPath> CareerPaths { get; set; }
        public DbSet<CareerPathProgram> CareerPathPrograms { get; set; }
        public DbSet<User> Users { get; set; }
        public DbSet<Role> Roles { get; set; }
        public DbSet<UserRole> UserRoles { get; set; }
        public DbSet<Permission> Permissions { get; set; }
        public DbSet<RolePermission> RolePermissions { get; set; }
        public DbSet<Application> Applications { get; set; }
        public DbSet<Payment> Payments { get; set; }
        public DbSet<Enrollment> Enrollments { get; set; }
        public DbSet<Partner> Partners { get; set; }
        public DbSet<Testimonial> Testimonials { get; set; }

        //save enums as text instead of numbers
        protected override void ConfigureConventions(ModelConfigurationBuilder configurationBuilder)
        {
            configurationBuilder.Properties<CourseType>().HaveConversion<string>().HaveMaxLength(30);
            configurationBuilder.Properties<CatalogStatus>().HaveConversion<string>().HaveMaxLength(30);
            configurationBuilder.Properties<ApplicationStatus>().HaveConversion<string>().HaveMaxLength(30);
            configurationBuilder.Properties<PaymentStatus>().HaveConversion<string>().HaveMaxLength(30);
            configurationBuilder.Properties<PaymentMethod>().HaveConversion<string>().HaveMaxLength(30);
            configurationBuilder.Properties<EnrollmentStatus>().HaveConversion<string>().HaveMaxLength(30);
            configurationBuilder.Properties<PartnerType>().HaveConversion<string>().HaveMaxLength(30);
        }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            // keys for the linking tables
            modelBuilder.Entity<ProgramCourse>().HasKey(pc => new { pc.ProgramId, pc.CourseId });
            modelBuilder.Entity<CareerPathProgram>().HasKey(cp => new { cp.CareerPathId, cp.ProgramId });
            modelBuilder.Entity<UserRole>().HasKey(ur => new { ur.UserId, ur.RoleId });
            modelBuilder.Entity<RolePermission>().HasKey(rp => new { rp.RoleId, rp.PermissionId });

            // unique values
            modelBuilder.Entity<User>().HasIndex(u => u.Email).IsUnique();
            modelBuilder.Entity<Role>().HasIndex(r => r.Name).IsUnique();
            modelBuilder.Entity<Category>().HasIndex(c => c.Name).IsUnique();
            modelBuilder.Entity<Permission>().HasIndex(p => new { p.Name, p.Action }).IsUnique();

            // one Application results in one Enrollment
            modelBuilder.Entity<Enrollment>()
                .HasOne(e => e.Application)
                .WithOne(a => a.Enrollment)
                .HasForeignKey<Enrollment>(e => e.ApplicationId);

            // an Application is for a Course or a Program (exactly one)
            modelBuilder.Entity<Application>().ToTable(t => t.HasCheckConstraint(
                "CK_Application_CourseOrProgram",
                "([CourseId] IS NOT NULL AND [ProgramId] IS NULL) OR ([CourseId] IS NULL AND [ProgramId] IS NOT NULL)"));

            // an Instructor (User) teaches many Courses
            modelBuilder.Entity<Course>()
                .HasOne(c => c.Instructor)
                .WithMany(u => u.CoursesTaught)
                .HasForeignKey(c => c.InstructorId);

            
            foreach (var foreignKey in modelBuilder.Model.GetEntityTypes().SelectMany(e => e.GetForeignKeys()))
            {
                foreignKey.DeleteBehavior = DeleteBehavior.Restrict;
            }
        }
    }
}