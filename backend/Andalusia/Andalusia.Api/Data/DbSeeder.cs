using Andalusia.Api.Enums;
using Andalusia.Api.Models;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;

namespace Andalusia.Api.Data
{
    public static class DbSeeder
    {
        public static async Task SeedAsync(AppDbContext context)
        {
            // Only seed an empty database
            if (await context.Categories.AnyAsync())
                return;

            var today = DateOnly.FromDateTime(DateTime.Today);

            // ---------- 1. Roles ----------
            var learnerRole = new Role { Name = "Learner", Description = "Browses, applies to and attends courses" };
            var instructorRole = new Role { Name = "Instructor", Description = "Teaches courses and manages attendance and assignments" };
            var adminRole = new Role { Name = "Admin", Description = "Manages students, instructors, courses and payments" };
            var contentManagerRole = new Role { Name = "ContentManager", Description = "Manages public website content" };
            context.Roles.AddRange(learnerRole, instructorRole, adminRole, contentManagerRole);

            // ---------- 2. Instructors ----------
            var hasher = new PasswordHasher<User>();

            var ahmed = new User
            {
                FirstName = "Ahmed",
                LastName = "Hassan",
                Email = "ahmed.hassan@andalusia.edu",
                Specialization = "Full-Stack Development",
                Bio = "Senior software engineer with 10 years of experience in .NET and React.",
                EmailConfirmed = true
            };
            ahmed.PasswordHash = hasher.HashPassword(ahmed, "Instructor@123");

            var mona = new User
            {
                FirstName = "Mona",
                LastName = "Adel",
                Email = "mona.adel@andalusia.edu",
                Specialization = "Data Analytics",
                Bio = "Data analyst and trainer specialised in SQL, Python and Power BI.",
                EmailConfirmed = true
            };
            mona.PasswordHash = hasher.HashPassword(mona, "Instructor@123");

            context.Users.AddRange(ahmed, mona);
            context.UserRoles.AddRange(
                new UserRole { User = ahmed, Role = instructorRole },
                new UserRole { User = mona, Role = instructorRole });

            // ---------- 3. Categories ----------
            var webDev = new Category { Name = "Web Development", Description = "Frontend and backend development", IsFeatured = true };
            var dataScience = new Category { Name = "Data Science", Description = "Data analysis, databases and reporting", IsFeatured = true };
            var business = new Category { Name = "Business", Description = "Management and marketing skills", IsFeatured = true };
            var design = new Category { Name = "Design", Description = "UI/UX and visual design", IsFeatured = true };
            context.Categories.AddRange(webDev, dataScience, business, design);

            // ---------- 4. Courses ----------
            var react = new Course
            {
                Title = "React from Scratch",
                ShortDescription = "Build modern web interfaces with React and TypeScript.",
                FullDescription = "Learn components, hooks, routing and calling APIs by building a complete single-page application.",
                Objectives = "Build reusable components\nManage state with hooks\nCall REST APIs with axios",
                DurationHours = 40,
                Price = 1200,
                Capacity = 25,
                Location = "Andalusia Academy, Cairo",
                Schedule = "Sun & Tue, 6-9 PM",
                StartDate = today.AddDays(14),
                EndDate = today.AddDays(70),
                Status = CatalogStatus.OpenForEnrollment,
                IsFeatured = true,
                Category = webDev,
                Instructor = ahmed
            };

            var aspNet = new Course
            {
                Title = "ASP.NET Core Web API",
                ShortDescription = "Design and build REST APIs with .NET and EF Core.",
                FullDescription = "Build a layered Web API with controllers, services, repositories, EF Core and SQL Server.",
                Objectives = "Design REST endpoints\nUse EF Core with SQL Server\nApply clean architecture",
                DurationHours = 48,
                Price = 1500,
                Capacity = 25,
                Location = "Andalusia Academy, Cairo",
                Schedule = "Mon & Wed, 6-9 PM",
                StartDate = today.AddDays(21),
                EndDate = today.AddDays(84),
                Status = CatalogStatus.OpenForEnrollment,
                IsFeatured = true,
                Category = webDev,
                Instructor = ahmed
            };

            var sql = new Course
            {
                Title = "SQL Server Essentials",
                ShortDescription = "Relational modelling, queries and indexing fundamentals.",
                FullDescription = "Design relational databases and write queries, joins and stored procedures in SQL Server.",
                Objectives = "Design tables and relationships\nWrite queries and joins\nUnderstand indexes",
                DurationHours = 30,
                Price = 900,
                Capacity = 30,
                Location = "Andalusia Academy, Cairo",
                Schedule = "Sat, 10 AM-2 PM",
                StartDate = today.AddDays(7),
                EndDate = today.AddDays(49),
                Status = CatalogStatus.OpenForEnrollment,
                IsFeatured = true,
                Category = dataScience,
                Instructor = mona
            };

            var python = new Course
            {
                Title = "Python for Data Analysis",
                ShortDescription = "Analyse real datasets with Python, pandas and charts.",
                FullDescription = "Clean, analyse and visualise data using Python, pandas and matplotlib.",
                Objectives = "Load and clean data\nAnalyse data with pandas\nCreate charts",
                DurationHours = 36,
                Price = 1100,
                Capacity = 25,
                Location = "Andalusia Academy, Cairo",
                Schedule = "Sun & Thu, 6-9 PM",
                StartDate = today.AddDays(28),
                EndDate = today.AddDays(84),
                Status = CatalogStatus.OpenForEnrollment,
                Category = dataScience,
                Instructor = mona
            };

            var powerBi = new Course
            {
                Title = "Power BI Dashboards",
                ShortDescription = "Turn data into interactive business dashboards.",
                FullDescription = "Connect data sources, model data and build interactive Power BI reports.",
                DurationHours = 24,
                Price = 950,
                Capacity = 25,
                Location = "Andalusia Academy, Cairo",
                StartDate = today.AddDays(60),
                Status = CatalogStatus.ComingSoon,
                Category = dataScience,
                Instructor = mona
            };

            var projectManagement = new Course
            {
                Title = "Project Management Fundamentals",
                ShortDescription = "Plan, run and deliver projects on time.",
                FullDescription = "Learn planning, scheduling, risk management and agile basics.",
                DurationHours = 20,
                Price = 800,
                Capacity = 30,
                Location = "Andalusia Academy, Cairo",
                Schedule = "Sat, 2-6 PM",
                StartDate = today.AddDays(10),
                EndDate = today.AddDays(40),
                Status = CatalogStatus.OpenForEnrollment,
                Category = business
            };

            var digitalMarketing = new Course
            {
                Title = "Digital Marketing",
                ShortDescription = "Grow a brand with social media, SEO and ads.",
                FullDescription = "Plan campaigns, use SEO and measure results with analytics tools.",
                DurationHours = 24,
                Price = 850,
                Capacity = 20,
                Location = "Andalusia Academy, Cairo",
                Schedule = "Tue, 6-9 PM",
                StartDate = today.AddDays(5),
                EndDate = today.AddDays(45),
                Status = CatalogStatus.Full,
                Category = business
            };

            var uiUx = new Course
            {
                Title = "UI/UX Design Basics",
                ShortDescription = "Design user-friendly interfaces with Figma.",
                FullDescription = "Learn user research, wireframes, prototypes and design systems in Figma.",
                DurationHours = 30,
                Price = 1000,
                Capacity = 20,
                Location = "Andalusia Academy, Cairo",
                StartDate = today.AddDays(45),
                Status = CatalogStatus.ComingSoon,
                IsFeatured = true,
                Category = design
            };

            context.Courses.AddRange(react, aspNet, sql, python, powerBi, projectManagement, digitalMarketing, uiUx);

            // ---------- 5. Programs (with their courses in order) ----------
            var fullStackProgram = new AcademyProgram
            {
                Title = "Full-Stack Development Diploma",
                ShortDescription = "Become a full-stack developer with React, .NET and SQL.",
                Overview = "A complete path from databases to backend APIs to modern frontends, ending with a real project.",
                Requirements = "Basic computer skills. No previous programming experience needed.",
                DurationWeeks = 16,
                Price = 3000,
                Capacity = 25,
                PaymentInfo = "Pay in full or in 3 installments",
                Location = "Andalusia Academy, Cairo",
                StartDate = today.AddDays(7),
                EndDate = today.AddDays(119),
                Status = CatalogStatus.OpenForEnrollment,
                IsFeatured = true,
                Category = webDev
            };
            fullStackProgram.ProgramCourses.Add(new ProgramCourse { Course = sql, SortOrder = 1 });
            fullStackProgram.ProgramCourses.Add(new ProgramCourse { Course = aspNet, SortOrder = 2 });
            fullStackProgram.ProgramCourses.Add(new ProgramCourse { Course = react, SortOrder = 3 });

            var dataProgram = new AcademyProgram
            {
                Title = "Data Analytics Diploma",
                ShortDescription = "Learn SQL, Python and Power BI to become a data analyst.",
                Overview = "Go from raw data to clear business insight using industry tools.",
                Requirements = "Basic Excel knowledge is recommended.",
                DurationWeeks = 12,
                Price = 2500,
                Capacity = 25,
                PaymentInfo = "Pay in full or in 2 installments",
                Location = "Andalusia Academy, Cairo",
                StartDate = today.AddDays(14),
                EndDate = today.AddDays(98),
                Status = CatalogStatus.OpenForEnrollment,
                IsFeatured = true,
                Category = dataScience
            };
            dataProgram.ProgramCourses.Add(new ProgramCourse { Course = sql, SortOrder = 1 });
            dataProgram.ProgramCourses.Add(new ProgramCourse { Course = python, SortOrder = 2 });
            dataProgram.ProgramCourses.Add(new ProgramCourse { Course = powerBi, SortOrder = 3 });

            context.Programs.AddRange(fullStackProgram, dataProgram);

            // ---------- 6. Career paths (with recommended programs) ----------
            var fullStackPath = new CareerPath
            {
                Title = "Full-Stack Developer",
                ShortDescription = "Build complete web applications, from database to user interface.",
                Overview = "Full-stack developers design databases, build APIs and create the screens users interact with.",
                RecommendedSkills = "C#, ASP.NET Core, SQL, React, TypeScript, Git",
                IsFeatured = true,
                IsPublished = true
            };
            fullStackPath.CareerPathPrograms.Add(new CareerPathProgram { Program = fullStackProgram, SortOrder = 1 });

            var dataAnalystPath = new CareerPath
            {
                Title = "Data Analyst",
                ShortDescription = "Turn raw data into reports and business insight.",
                Overview = "Data analysts collect, clean and analyse data, then present results with dashboards.",
                RecommendedSkills = "SQL, Python, pandas, Power BI, Excel",
                IsFeatured = true,
                IsPublished = true
            };
            dataAnalystPath.CareerPathPrograms.Add(new CareerPathProgram { Program = dataProgram, SortOrder = 1 });

            context.CareerPaths.AddRange(fullStackPath, dataAnalystPath);

            // ---------- 7. Partners ----------
            context.Partners.AddRange(
                new Partner { Name = "Microsoft", WebsiteUrl = "https://microsoft.com", Type = PartnerType.Partner, DisplayOrder = 1 },
                new Partner { Name = "Oracle", WebsiteUrl = "https://oracle.com", Type = PartnerType.Partner, DisplayOrder = 2 },
                new Partner { Name = "Cisco", WebsiteUrl = "https://cisco.com", Type = PartnerType.Accreditation, DisplayOrder = 3 },
                new Partner { Name = "IBM", WebsiteUrl = "https://ibm.com", Type = PartnerType.Accreditation, DisplayOrder = 4 });

            // ---------- 8. Testimonials ----------
            context.Testimonials.AddRange(
                new Testimonial { AuthorName = "Nour Hassan", AuthorTitle = "Front-end developer", Content = "The full-stack diploma took me from my first component to shipping a real project.", Rating = 5, IsPublished = true },
                new Testimonial { AuthorName = "Omar Fathy", AuthorTitle = "Data analyst", Content = "Clear explanations and real projects. I used what I learned at work the same week.", Rating = 5, IsPublished = true },
                new Testimonial { AuthorName = "Salma Adel", AuthorTitle = "Software engineering student", Content = "The instructors actually answer questions. That made the difference for me.", Rating = 4, IsPublished = true });

            await context.SaveChangesAsync();
        }
    }
}