using Andalusia.Api.Enums;
using Andalusia.Api.Models;
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
            

            var ahmed = new User
            {
                FirstName = "Demo",
                LastName = "Instructor",
                Email = "instructor@andalusia.edu",
                Specialization = "Full-Stack Development",
                Bio = "Senior software engineer with 10 years of experience in .NET and React.",
                EmailConfirmed = true
            };
            ahmed.PasswordHash = BCrypt.Net.BCrypt.HashPassword("Instructor@123");
            var mona = new User
            {
                FirstName = "Mona",
                LastName = "Adel",
                Email = "mona.adel@andalusia.edu",
                Specialization = "Data Analytics",
                Bio = "Data analyst and trainer specialised in SQL, Python and Power BI.",
                EmailConfirmed = true
            };
            mona.PasswordHash = BCrypt.Net.BCrypt.HashPassword("Instructor@123");

            var admin = new User
            {
                FirstName = "Salma",
                LastName = "Sherif",
                Email = "admin@andalusia.edu",
                EmailConfirmed = true,
                PasswordHash = BCrypt.Net.BCrypt.HashPassword("Admin@123")
            };

            var learner = new User
            {
                FirstName = "Youssef",
                LastName = "Waleed",
                Email = "learner@andalusia.edu",
                EmailConfirmed = true,
                PasswordHash = BCrypt.Net.BCrypt.HashPassword("Learner@123")
            };

            context.Users.AddRange(admin, learner);
            context.UserRoles.AddRange(
                new UserRole { User = admin, Role = adminRole },
                new UserRole { User = learner, Role = learnerRole });
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
                // Logos are the official files hosted on Wikimedia Commons (the site shows the name if one fails to load)
                new Partner { Name = "Microsoft", LogoUrl = "https://upload.wikimedia.org/wikipedia/commons/9/96/Microsoft_logo_%282012%29.svg", WebsiteUrl = "https://microsoft.com", Type = PartnerType.Partner, DisplayOrder = 1 },
                new Partner { Name = "Oracle", LogoUrl = "https://upload.wikimedia.org/wikipedia/commons/5/50/Oracle_logo.svg", WebsiteUrl = "https://oracle.com", Type = PartnerType.Partner, DisplayOrder = 2 },
                new Partner { Name = "Cisco", LogoUrl = "https://upload.wikimedia.org/wikipedia/commons/0/08/Cisco_logo_blue_2016.svg", WebsiteUrl = "https://cisco.com", Type = PartnerType.Accreditation, DisplayOrder = 3 },
                new Partner { Name = "IBM", LogoUrl = "https://upload.wikimedia.org/wikipedia/commons/5/51/IBM_logo.svg", WebsiteUrl = "https://ibm.com", Type = PartnerType.Accreditation, DisplayOrder = 4 });

            // ---------- 8. Testimonials ----------
            context.Testimonials.AddRange(
                new Testimonial { AuthorName = "Nour Hassan", AuthorTitle = "Front-end developer", Content = "The full-stack diploma took me from my first component to shipping a real project.", Rating = 5, IsPublished = true },
                new Testimonial { AuthorName = "Omar Fathy", AuthorTitle = "Data analyst", Content = "Clear explanations and real projects. I used what I learned at work the same week.", Rating = 5, IsPublished = true },
                new Testimonial { AuthorName = "Salma Adel", AuthorTitle = "Software engineering student", Content = "The instructors actually answer questions. That made the difference for me.", Rating = 4, IsPublished = true });

            // ---------- 9. Demo enrollments (so the LMS has data) ----------
            var learner2 = new User
            {
                FirstName = "Nada",
                LastName = "Ibrahim",
                Email = "learner2@andalusia.edu",
                EmailConfirmed = true,
                PasswordHash = BCrypt.Net.BCrypt.HashPassword("Learner@123")
            };
            context.Users.Add(learner2);
            context.UserRoles.Add(new UserRole { User = learner2, Role = learnerRole });

            var now = DateTime.UtcNow;

            // Youssef and Nada are enrolled in the demo instructor's ASP.NET course (applied → paid → enrolled)
            foreach (var student in new[] { learner, learner2 })
            {
                var application = new Application
                {
                    User = student,
                    Course = aspNet,
                    Status = ApplicationStatus.Accepted,
                    CreatedAt = now.AddDays(-10),
                    ReviewedAt = now.AddDays(-10)
                };
                application.Payments.Add(new Payment
                {
                    Amount = aspNet.Price,
                    Method = PaymentMethod.Card,
                    Status = PaymentStatus.Paid,
                    TransactionId = $"SIM-SEED-{Guid.NewGuid():N}",
                    CreatedAt = now.AddDays(-10),
                    PaidAt = now.AddDays(-10)
                });
                application.Enrollment = new Enrollment
                {
                    Status = EnrollmentStatus.Active,
                    EnrolledAt = now.AddDays(-10)
                };
                context.Applications.Add(application);
            }

            // ---------- 10. Sessions ----------
            var session1 = new Session
            {
                Course = aspNet,
                Title = "Introduction to Web APIs",
                Description = "HTTP, REST and setting up the project.",
                StartTime = now.Date.AddDays(-7).AddHours(16),
                EndTime = now.Date.AddDays(-7).AddHours(18),
                Location = "Room 3"
            };
            var session2 = new Session
            {
                Course = aspNet,
                Title = "Controllers and Routing",
                Description = "Building endpoints and returning the right status codes.",
                StartTime = now.Date.AddDays(-3).AddHours(16),
                EndTime = now.Date.AddDays(-3).AddHours(18),
                Location = "Room 3"
            };
            var session3 = new Session
            {
                Course = aspNet,
                Title = "Entity Framework Core",
                Description = "Models, DbContext and migrations.",
                StartTime = now.Date.AddDays(4).AddHours(16),
                EndTime = now.Date.AddDays(4).AddHours(18),
                Location = "Room 3"
            };
            var session4 = new Session
            {
                Course = aspNet,
                Title = "Authentication with JWT",
                Description = "Login, tokens and protecting endpoints.",
                StartTime = now.Date.AddDays(11).AddHours(16),
                EndTime = now.Date.AddDays(11).AddHours(18),
                Location = "Room 3"
            };
            var reactSession = new Session
            {
                Course = react,
                Title = "Components and Props",
                Description = "Your first React components.",
                StartTime = now.Date.AddDays(14).AddHours(18),
                EndTime = now.Date.AddDays(14).AddHours(20),
                Location = "Room 1"
            };
            context.Sessions.AddRange(session1, session2, session3, session4, reactSession);

            // ---------- 11. Attendance (past sessions only) ----------
            context.Attendances.AddRange(
                new Attendance { Session = session1, User = learner, Status = AttendanceStatus.Present, MarkedAt = session1.EndTime },
                new Attendance { Session = session1, User = learner2, Status = AttendanceStatus.Present, MarkedAt = session1.EndTime },
                new Attendance { Session = session2, User = learner, Status = AttendanceStatus.Present, MarkedAt = session2.EndTime },
                new Attendance { Session = session2, User = learner2, Status = AttendanceStatus.Absent, MarkedAt = session2.EndTime });

            // ---------- 12. Materials (real PDFs served by the API + real Microsoft Learn / React links) ----------
            // PDFs live in wwwroot/files/materials and are served at /files/materials/...
            var aspWeek1Notes = new Material
            {
                Course = aspNet,
                Title = "Week 1 lecture notes: Introduction to Web APIs",
                Description = "HTTP basics, REST, and how an ASP.NET Core project is organised.",
                Type = MaterialType.Document,
                Url = "/files/materials/aspnet-week1-introduction-to-web-apis.pdf",
                CreatedAt = now.AddDays(-7)
            };
            var aspWebApiVideo = new Material
            {
                Course = aspNet,
                Title = "Video: Implementing a Web API in .NET",
                Description = "Microsoft Learn — Back-end web development with .NET for beginners.",
                Type = MaterialType.Video,
                Url = "https://learn.microsoft.com/en-us/shows/back-end-web-development-with-dotnet-for-beginners/implementing-a-web-api-in-dotnet-backend-web-development-with-dotnet-for-beginners",
                CreatedAt = now.AddDays(-7).AddMinutes(1)
            };
            var aspTutorial = new Material
            {
                Course = aspNet,
                Title = "Tutorial: Create a controller-based web API",
                Description = "Official step-by-step tutorial from Microsoft.",
                Type = MaterialType.Link,
                Url = "https://learn.microsoft.com/en-us/aspnet/core/tutorials/first-web-api",
                CreatedAt = now.AddDays(-6)
            };
            var aspWeek2Notes = new Material
            {
                Course = aspNet,
                Title = "Week 2 lecture notes: Controllers and routing",
                Description = "Attribute routing, action results and status codes.",
                Type = MaterialType.Document,
                Url = "/files/materials/aspnet-week2-controllers-and-routing.pdf",
                CreatedAt = now.AddDays(-3)
            };
            var aspStatusCodes = new Material
            {
                Course = aspNet,
                Title = "Cheat sheet: HTTP status codes",
                Description = "Which status code to return, and when.",
                Type = MaterialType.Document,
                Url = "/files/materials/http-status-codes-cheat-sheet.pdf",
                CreatedAt = now.AddDays(-3).AddMinutes(1)
            };
            var aspEfVideo = new Material
            {
                Course = aspNet,
                Title = "Video series: Entity Framework Core for Beginners",
                Description = "Microsoft Learn — get ready for next week's session.",
                Type = MaterialType.Video,
                Url = "https://learn.microsoft.com/en-us/shows/entity-framework-core-for-beginners",
                CreatedAt = now.AddDays(-2)
            };

            var reactNotes = new Material
            {
                Course = react,
                Title = "Week 1 lecture notes: Components, props and state",
                Description = "Read before the first session.",
                Type = MaterialType.Document,
                Url = "/files/materials/react-week1-components-props-state.pdf",
                CreatedAt = now.AddDays(-1)
            };
            var reactLearn = new Material
            {
                Course = react,
                Title = "React official guide: Quick Start",
                Description = "The official React documentation.",
                Type = MaterialType.Link,
                Url = "https://react.dev/learn",
                CreatedAt = now.AddDays(-1).AddMinutes(1)
            };

            var sqlNotes = new Material
            {
                Course = sql,
                Title = "Week 1 lecture notes: SELECT, WHERE and JOIN",
                Description = "Core T-SQL queries with examples.",
                Type = MaterialType.Document,
                Url = "/files/materials/sql-week1-select-where-join.pdf",
                CreatedAt = now.AddDays(-1)
            };

            context.Materials.AddRange(
                aspWeek1Notes, aspWebApiVideo, aspTutorial, aspWeek2Notes, aspStatusCodes, aspEfVideo,
                reactNotes, reactLearn, sqlNotes);

            // Learners marked some materials as done (counts in progress)
            context.MaterialCompletions.AddRange(
                new MaterialCompletion { Material = aspWeek1Notes, User = learner, CompletedAt = now.AddDays(-6) },
                new MaterialCompletion { Material = aspWebApiVideo, User = learner, CompletedAt = now.AddDays(-6) },
                new MaterialCompletion { Material = aspTutorial, User = learner, CompletedAt = now.AddDays(-5) },
                new MaterialCompletion { Material = aspWeek2Notes, User = learner, CompletedAt = now.AddDays(-2) },
                new MaterialCompletion { Material = aspWeek1Notes, User = learner2, CompletedAt = now.AddDays(-5) });

            // ---------- 13. Assignments + submissions ----------
            var assignment1 = new Assignment
            {
                Course = aspNet,
                Title = "Build your first endpoint",
                Description = "Create a GET endpoint that returns a list of books.",
                DueDate = now.Date.AddDays(-1).AddHours(23).AddMinutes(59),
                MaxScore = 100,
                CreatedAt = now.AddDays(-7)
            };
            var assignment2 = new Assignment
            {
                Course = aspNet,
                Title = "CRUD API with EF Core",
                Description = "Add create, update and delete endpoints using EF Core.",
                DueDate = now.Date.AddDays(10).AddHours(23).AddMinutes(59),
                MaxScore = 100,
                CreatedAt = now.AddDays(-3)
            };
            context.Assignments.AddRange(assignment1, assignment2);

            context.Submissions.AddRange(
                // Youssef: submitted and graded
                new Submission
                {
                    Assignment = assignment1,
                    User = learner,
                    Content = "My endpoint is GET /api/books and returns 3 books.",
                    FileUrl = "https://github.com/youssef/books-api",
                    SubmittedAt = now.AddDays(-2),
                    Status = SubmissionStatus.Graded,
                    Score = 85,
                    Feedback = "Good work. Remember to return 404 when a book is not found.",
                    GradedAt = now.AddDays(-1)
                },
                // Nada: submitted, waiting for the instructor to grade
                new Submission
                {
                    Assignment = assignment1,
                    User = learner2,
                    Content = "Done, see my repository.",
                    FileUrl = "https://github.com/nada/first-endpoint",
                    SubmittedAt = now.AddDays(-1),
                    Status = SubmissionStatus.Submitted
                });

            await context.SaveChangesAsync();
        }
    }
}