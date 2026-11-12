using Andalusia.Api.Enums;
using Andalusia.Api.Models;
using Microsoft.EntityFrameworkCore;

namespace Andalusia.Api.Data
{
    // Demo learner who has finished "ASP.NET Core Web API" (100% progress), so the certificate
    // can be shown straight away. Runs on existing databases too, but only once: it does nothing
    // when the graduate account already exists.
    //   Login: graduate@andalusia.edu / Learner@123
    public static class CertificateDemoSeeder
    {
        private const string Email = "graduate@andalusia.edu";
        private const string CourseTitle = "ASP.NET Core Web API";

        public static async Task SeedAsync(AppDbContext context)
        {
            if (await context.Users.AnyAsync(u => u.Email == Email))
                return;

            var learnerRole = await context.Roles.FirstOrDefaultAsync(r => r.Name == "Learner");
            var course = await context.Courses
                .Include(c => c.Sessions)
                .Include(c => c.Materials)
                .Include(c => c.Assignments)
                .FirstOrDefaultAsync(c => c.Title == CourseTitle && !c.IsDeleted);

            if (learnerRole == null || course == null)
                return;

            var now = DateTime.UtcNow;

            var graduate = new User
            {
                FirstName = "Hana",
                LastName = "Khaled",
                Email = Email,
                EmailConfirmed = true,
                PasswordHash = BCrypt.Net.BCrypt.HashPassword("Learner@123"),
                CreatedAt = now.AddDays(-30)
            };
            context.Users.Add(graduate);
            context.UserRoles.Add(new UserRole { User = graduate, Role = learnerRole });

            // Applied -> accepted -> paid -> enrolled
            var application = new Application
            {
                User = graduate,
                CourseId = course.Id,
                Status = ApplicationStatus.Accepted,
                CreatedAt = now.AddDays(-30),
                ReviewedAt = now.AddDays(-29)
            };
            application.Payments.Add(new Payment
            {
                Amount = course.Price,
                Method = PaymentMethod.Card,
                Status = PaymentStatus.Paid,
                TransactionId = $"SIM-SEED-{Guid.NewGuid():N}",
                CreatedAt = now.AddDays(-29),
                PaidAt = now.AddDays(-29)
            });
            application.Enrollment = new Enrollment
            {
                Status = EnrollmentStatus.Active,
                EnrolledAt = now.AddDays(-29),
                ProgressPercent = 100
            };
            context.Applications.Add(application);

            // Present at every session (also future ones, so progress stays at 100% as time passes)
            foreach (var session in course.Sessions)
            {
                context.Attendances.Add(new Attendance
                {
                    SessionId = session.Id,
                    User = graduate,
                    Status = AttendanceStatus.Present,
                    MarkedAt = session.StartTime <= now ? session.StartTime : now
                });
            }

            // Every material completed
            foreach (var material in course.Materials)
            {
                context.MaterialCompletions.Add(new MaterialCompletion
                {
                    MaterialId = material.Id,
                    User = graduate,
                    CompletedAt = now.AddDays(-2)
                });
            }

            // Every assignment submitted and graded
            var scores = new[] { 95, 88, 92, 97 };
            var index = 0;
            foreach (var assignment in course.Assignments)
            {
                var max = assignment.MaxScore > 0 ? assignment.MaxScore : 100;
                context.Submissions.Add(new Submission
                {
                    AssignmentId = assignment.Id,
                    User = graduate,
                    Content = "Submitted for the demo: https://github.com/andalusia-demo/aspnet-api",
                    SubmittedAt = now.AddDays(-3),
                    Status = SubmissionStatus.Graded,
                    Score = Math.Min(max, scores[index++ % scores.Length] * max / 100),
                    Feedback = "Great work!",
                    GradedAt = now.AddDays(-1)
                });
            }

            await context.SaveChangesAsync();
        }
    }
}
