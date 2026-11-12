using Andalusia.Api.Enums;
using Andalusia.Api.Models;
using Microsoft.EntityFrameworkCore;

namespace Andalusia.Api.Data
{
    // Demo LMS content for "React from Scratch": a full term of sessions, materials and assignments.
    // Unlike DbSeeder it also runs on an existing database, but only once: it does nothing when the
    // course already has an assignment (so an instructor's own changes or deletions are left alone).
    public static class ReactCourseDemoSeeder
    {
        private const string CourseTitle = "React from Scratch";

        public static async Task SeedAsync(AppDbContext context)
        {
            var course = await context.Courses
                .Include(c => c.Sessions)
                .Include(c => c.Materials)
                .Include(c => c.Assignments)
                .FirstOrDefaultAsync(c => c.Title == CourseTitle && !c.IsDeleted);

            if (course == null || course.Assignments.Count > 0)
                return;

            var now = DateTime.UtcNow;

            // The course meets "Sun & Tue, 6-9 PM" (Cairo, UTC+2) = 16:00-19:00 UTC, from its start date
            var start = course.StartDate ?? DateOnly.FromDateTime(now).AddDays(14);
            var firstSunday = start.AddDays(((int)DayOfWeek.Sunday - (int)start.DayOfWeek + 7) % 7);

            // Class 0 is the first Sunday, class 1 the Tuesday after it, and so on
            DateTime ClassStart(int index) =>
                firstSunday.AddDays(index / 2 * 7 + index % 2 * 2).ToDateTime(new TimeOnly(16, 0), DateTimeKind.Utc);

            // 23:59 Cairo time the night before a class
            DateTime DueBefore(int index) => ClassStart(index).Date.AddDays(-1).AddHours(21).AddMinutes(59);

            // ---------- Sessions ----------
            var sessions = new (string Title, string Description)[]
            {
                ("Components and Props", "Your first React components."),
                ("State and Events", "useState, handling clicks and inputs, and lifting state up."),
                ("Lists, Keys and Forms", "Rendering lists, controlled inputs and simple validation."),
                ("Effects and Fetching Data", "useEffect, loading and error states, and calling a REST API with axios."),
                ("Routing with React Router", "Pages, links, URL parameters and protected routes."),
                ("Custom Hooks and Context", "Sharing logic and app-wide state without prop drilling."),
                ("React with TypeScript", "Typing props, state and API responses."),
                ("Final Project Demo Day", "Present your app to the class and get feedback."),
            };

            var sessionTitles = course.Sessions.Select(s => s.Title).ToHashSet(StringComparer.OrdinalIgnoreCase);
            for (var i = 0; i < sessions.Length; i++)
            {
                if (sessionTitles.Contains(sessions[i].Title))
                    continue;

                context.Sessions.Add(new Session
                {
                    CourseId = course.Id,
                    Title = sessions[i].Title,
                    Description = sessions[i].Description,
                    StartTime = ClassStart(i),
                    EndTime = ClassStart(i).AddHours(3),
                    Location = "Room 1"
                });
            }

            // ---------- Materials (official docs + two well-known beginner videos) ----------
            var materials = new (string Title, string Description, MaterialType Type, string Url)[]
            {
                ("Thinking in React", "How to break a UI into components. Read before the first session.",
                    MaterialType.Link, "https://react.dev/learn/thinking-in-react"),
                ("Video: React in 100 Seconds", "A quick overview of what React is and why it's used (Fireship).",
                    MaterialType.Video, "https://www.youtube.com/watch?v=Tn6-PIqc4UM"),
                ("Video: React Tutorial for Beginners", "A full beginner walkthrough (Programming with Mosh).",
                    MaterialType.Video, "https://www.youtube.com/watch?v=SqcY0GlETPk"),
                ("Managing State", "Official guide for the State and Events session.",
                    MaterialType.Link, "https://react.dev/learn/managing-state"),
                ("Rendering Lists", "Mapping arrays to components and why keys matter.",
                    MaterialType.Link, "https://react.dev/learn/rendering-lists"),
                ("Synchronizing with Effects", "useEffect explained, for the data-fetching session.",
                    MaterialType.Link, "https://react.dev/learn/synchronizing-with-effects"),
                ("React Router documentation", "Routes, links and URL parameters.",
                    MaterialType.Link, "https://reactrouter.com/home"),
                ("Reusing Logic with Custom Hooks", "When and how to write your own hooks.",
                    MaterialType.Link, "https://react.dev/learn/reusing-logic-with-custom-hooks"),
                ("Using TypeScript with React", "Typing components, props and hooks.",
                    MaterialType.Link, "https://react.dev/learn/typescript"),
                ("Cheat sheet: Built-in React hooks", "Every built-in hook on one page.",
                    MaterialType.Link, "https://react.dev/reference/react/hooks"),
            };

            var materialTitles = course.Materials.Select(m => m.Title).ToHashSet(StringComparer.OrdinalIgnoreCase);
            for (var i = 0; i < materials.Length; i++)
            {
                if (materialTitles.Contains(materials[i].Title))
                    continue;

                context.Materials.Add(new Material
                {
                    CourseId = course.Id,
                    Title = materials[i].Title,
                    Description = materials[i].Description,
                    Type = materials[i].Type,
                    Url = materials[i].Url,
                    // Keeps the list in this order (newest last)
                    CreatedAt = now.AddMinutes(i)
                });
            }

            // ---------- Assignments (each due the night before the class that builds on it) ----------
            context.Assignments.AddRange(
                new Assignment
                {
                    CourseId = course.Id,
                    Title = "Profile card component",
                    Description = "Build a reusable ProfileCard that takes a name, role and photo as props, then show three cards with different data.",
                    DueDate = DueBefore(2),
                    MaxScore = 100
                },
                new Assignment
                {
                    CourseId = course.Id,
                    Title = "To-do list with state",
                    Description = "Add, complete and delete tasks with useState. Bonus: keep the list in localStorage.",
                    DueDate = DueBefore(3),
                    MaxScore = 100
                },
                new Assignment
                {
                    CourseId = course.Id,
                    Title = "Course list from an API",
                    Description = "Fetch courses from the Andalusia API with axios, show loading and error states, and add a search box.",
                    DueDate = DueBefore(5),
                    MaxScore = 100
                },
                new Assignment
                {
                    CourseId = course.Id,
                    Title = "Final project: multi-page app",
                    Description = "Build a small app with React Router, at least one custom hook and TypeScript. You'll present it on demo day.",
                    DueDate = DueBefore(7),
                    MaxScore = 100
                });

            await context.SaveChangesAsync();
        }
    }
}
