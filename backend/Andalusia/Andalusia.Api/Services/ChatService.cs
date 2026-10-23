using System.Net;
using System.Net.Http.Json;
using System.Text;
using System.Text.Json.Serialization;
using Andalusia.Api.DTOs.Requests;
using Andalusia.Api.DTOs.Responses;
using Andalusia.Api.Enums;
using Andalusia.Api.Exceptions;
using Andalusia.Api.Helpers;
using Andalusia.Api.Repos.Interfaces;
using Andalusia.Api.Services.Interfaces;
using Microsoft.Extensions.Options;

namespace Andalusia.Api.Services
{
    // The course assistant: it reads the live catalog from the database ("retrieval"),
    // puts it in the instructions for a local Ollama model, and returns the model's answer.
    public class ChatService : IChatService
    {
        public const string HttpClientName = "ollama";

        private readonly IChatRepository _chatRepository;
        private readonly ILearnerService _learnerService;
        private readonly IHttpClientFactory _httpClientFactory;
        private readonly ChatSettings _settings;
        private readonly ILogger<ChatService> _logger;

        public ChatService(
            IChatRepository chatRepository,
            ILearnerService learnerService,
            IHttpClientFactory httpClientFactory,
            IOptions<ChatSettings> settings,
            ILogger<ChatService> logger)
        {
            _chatRepository = chatRepository;
            _learnerService = learnerService;
            _httpClientFactory = httpClientFactory;
            _settings = settings.Value;
            _logger = logger;
        }

        public async Task<ChatResponseDto> AskAsync(ChatRequestDto request, int? learnerId)
        {
            if (request.Messages.Count == 0 || request.Messages[^1].Role != "user")
                throw new BadRequestException("The last message must come from the user.");

            var catalog = await BuildCatalogAsync();
            var learnerContext = learnerId.HasValue ? await BuildLearnerContextAsync(learnerId.Value) : null;

            var messages = new List<OllamaMessage>
            {
                new("system", BuildSystemPrompt(catalog.Text, learnerContext))
            };
            messages.AddRange(request.Messages.Select(m => new OllamaMessage(m.Role, m.Content.Trim())));

            var reply = await CallOllamaAsync(messages);

            return new ChatResponseDto
            {
                Reply = reply,
                Links = FindMentionedItems(reply, catalog.Items)
            };
        }

        // ---------- Retrieval: the catalog as compact text ----------

        private record CatalogItem(string Type, int Id, string Title);
        private record Catalog(string Text, List<CatalogItem> Items);

        private async Task<Catalog> BuildCatalogAsync()
        {
            var courses = await _chatRepository.GetPublicCoursesAsync();
            var programs = await _chatRepository.GetPublicProgramsAsync();
            var careerPaths = await _chatRepository.GetPublishedCareerPathsAsync();

            var items = new List<CatalogItem>();
            var text = new StringBuilder();

            text.AppendLine("COURSES:");
            foreach (var c in courses)
            {
                items.Add(new CatalogItem("Course", c.Id, c.Title));
                var instructor = c.Instructor is null ? "TBA" : $"{c.Instructor.FirstName} {c.Instructor.LastName}";
                text.AppendLine(
                    $"- {c.Title} | category: {c.Category.Name} | {StatusLabel(c.Status)} | {(c.Type == CourseType.Online ? "online" : "on campus")}" +
                    $" | {Price(c.Price)} | {c.DurationHours} hours | starts {Date(c.StartDate)}, ends {Date(c.EndDate)}" +
                    $"{Optional("schedule", c.Schedule)}{Optional("location", c.Location)} | instructor: {instructor}");
                if (!string.IsNullOrWhiteSpace(c.ShortDescription))
                    text.AppendLine($"  About: {Shorten(c.ShortDescription, 220)}");
                if (!string.IsNullOrWhiteSpace(c.Objectives))
                    text.AppendLine($"  You will learn: {Shorten(c.Objectives.Replace("\n", "; ").Replace("\r", ""), 260)}");
            }

            text.AppendLine();
            text.AppendLine("PROGRAMS (a bundle of courses):");
            foreach (var p in programs)
            {
                items.Add(new CatalogItem("Program", p.Id, p.Title));
                var included = string.Join(", ", p.ProgramCourses.OrderBy(pc => pc.SortOrder).Select(pc => pc.Course.Title));
                text.AppendLine(
                    $"- {p.Title} | category: {p.Category.Name} | {StatusLabel(p.Status)} | {Price(p.Price)} | {p.DurationWeeks} weeks" +
                    $" | starts {Date(p.StartDate)}{Optional("schedule", p.Schedule)} | includes: {(included.Length > 0 ? included : "-")}");
                if (!string.IsNullOrWhiteSpace(p.ShortDescription))
                    text.AppendLine($"  About: {Shorten(p.ShortDescription, 220)}");
                if (!string.IsNullOrWhiteSpace(p.Requirements))
                    text.AppendLine($"  Requirements: {Shorten(p.Requirements, 160)}");
            }

            text.AppendLine();
            text.AppendLine("CAREER PATHS (recommended route of programs towards a job):");
            foreach (var cp in careerPaths)
            {
                items.Add(new CatalogItem("CareerPath", cp.Id, cp.Title));
                var route = string.Join(" → ", cp.CareerPathPrograms.OrderBy(x => x.SortOrder).Select(x => x.Program.Title));
                text.AppendLine($"- {cp.Title} | route: {(route.Length > 0 ? route : "-")}{Optional("skills", cp.RecommendedSkills)}");
                if (!string.IsNullOrWhiteSpace(cp.ShortDescription))
                    text.AppendLine($"  About: {Shorten(cp.ShortDescription, 220)}");
            }

            return new Catalog(text.ToString(), items);
        }

        // A signed-in learner's own courses, so it can answer "what should I take next?"
        private async Task<string?> BuildLearnerContextAsync(int learnerId)
        {
            try
            {
                var myCourses = await _learnerService.GetMyCoursesAsync(learnerId);
                var text = new StringBuilder();
                text.AppendLine("THE LEARNER YOU ARE TALKING TO is signed in.");
                if (myCourses.Count == 0)
                {
                    text.AppendLine("They are not enrolled in any course yet.");
                }
                else
                {
                    text.AppendLine("Their enrolled courses:");
                    foreach (var c in myCourses)
                    {
                        var next = c.NextSessionAt.HasValue ? $", next session {c.NextSessionAt.Value:dd MMM yyyy HH:mm} UTC" : "";
                        text.AppendLine($"- {c.Title}: {c.ProgressPercent}% progress, {c.PendingAssignments} assignment(s) not submitted{next}");
                    }
                }
                return text.ToString();
            }
            catch (Exception ex)
            {
                // The chatbot still works without the personal part
                _logger.LogWarning(ex, "Could not load learner context for the chatbot");
                return null;
            }
        }

        private static string BuildSystemPrompt(string catalog, string? learnerContext)
        {
            var prompt = new StringBuilder();
            prompt.AppendLine("You are the friendly course assistant of Andalusia Academy, a training academy in Alexandria, Egypt.");
            prompt.AppendLine("Your job: answer questions about the academy's courses, programs and career paths, and help learners choose what fits their goals, level, budget and time.");
            prompt.AppendLine();
            prompt.AppendLine("Rules:");
            prompt.AppendLine("- Use ONLY the catalog below for facts (titles, prices, dates, schedules, instructors). Never invent courses or numbers.");
            prompt.AppendLine("- If the catalog does not contain the answer, say you are not sure and suggest the Contact page.");
            prompt.AppendLine("- Write course, program and career path titles exactly as in the catalog.");
            prompt.AppendLine("- When recommending, suggest 1 to 3 options and say briefly why each fits. If you need more information (goal, experience, hours per week, budget), ask ONE short question.");
            prompt.AppendLine("- To apply, learners open the course page and press Apply, then pay from My applications.");
            prompt.AppendLine("- Keep answers short (under 150 words), friendly and clear. Use simple bullet points for lists. Reply in the same language the user writes in.");
            prompt.AppendLine("- Politely refuse topics unrelated to learning or the academy.");
            prompt.AppendLine();
            prompt.AppendLine("CATALOG (live data from the academy database):");
            prompt.AppendLine(catalog);
            if (learnerContext is not null)
            {
                prompt.AppendLine();
                prompt.AppendLine(learnerContext);
                prompt.AppendLine("Use this to personalise advice (e.g. what to take next). Do not recommend a course they are already enrolled in.");
            }
            return prompt.ToString();
        }

        // ---------- Ollama ----------

        private record OllamaMessage(
            [property: JsonPropertyName("role")] string Role,
            [property: JsonPropertyName("content")] string Content);

        private record OllamaOptions(
            [property: JsonPropertyName("num_ctx")] int NumCtx,
            [property: JsonPropertyName("temperature")] double Temperature,
            // Max length of the answer, so replies stay short and fast
            [property: JsonPropertyName("num_predict")] int NumPredict);

        private record OllamaRequest(
            [property: JsonPropertyName("model")] string Model,
            [property: JsonPropertyName("messages")] List<OllamaMessage> Messages,
            [property: JsonPropertyName("stream")] bool Stream,
            [property: JsonPropertyName("options")] OllamaOptions Options,
            // Keep the model loaded between questions so later answers are faster
            [property: JsonPropertyName("keep_alive")] string KeepAlive);

        private record OllamaResponse(
            [property: JsonPropertyName("message")] OllamaMessage? Message,
            [property: JsonPropertyName("error")] string? Error);

        private async Task<string> CallOllamaAsync(List<OllamaMessage> messages)
        {
            var client = _httpClientFactory.CreateClient(HttpClientName);
            var body = new OllamaRequest(
                _settings.Model,
                messages,
                Stream: false,
                new OllamaOptions(_settings.ContextSize, _settings.Temperature, NumPredict: 400),
                KeepAlive: "30m");

            HttpResponseMessage response;
            try
            {
                response = await client.PostAsJsonAsync("/api/chat", body);
            }
            catch (Exception ex) when (ex is HttpRequestException or TaskCanceledException)
            {
                _logger.LogWarning(ex, "Ollama is not reachable at {Url}", _settings.OllamaUrl);
                throw new ServiceUnavailableException(
                    "The assistant is offline right now. (Developer tip: start Ollama on this computer.)");
            }

            OllamaResponse? result = null;
            try
            {
                result = await response.Content.ReadFromJsonAsync<OllamaResponse>();
            }
            catch (Exception ex)
            {
                _logger.LogWarning(ex, "Unexpected answer from Ollama");
            }

            if (response.StatusCode == HttpStatusCode.NotFound)
                throw new ServiceUnavailableException(
                    $"The assistant's model is not installed. (Developer tip: run \"ollama pull {_settings.Model}\".)");

            if (!response.IsSuccessStatusCode || string.IsNullOrWhiteSpace(result?.Message?.Content))
            {
                _logger.LogWarning("Ollama error {Status}: {Error}", response.StatusCode, result?.Error);
                throw new ServiceUnavailableException("The assistant could not answer right now. Please try again.");
            }

            return result!.Message!.Content.Trim();
        }

        // ---------- Helpers ----------

        // Catalog items whose title appears in the reply (longest titles first, max 6)
        private static List<ChatLinkDto> FindMentionedItems(string reply, List<CatalogItem> items)
        {
            return items
                .Where(i => reply.Contains(i.Title, StringComparison.OrdinalIgnoreCase))
                .OrderByDescending(i => i.Title.Length)
                .Take(6)
                .Select(i => new ChatLinkDto { Type = i.Type, Id = i.Id, Title = i.Title })
                .ToList();
        }

        private static string StatusLabel(CatalogStatus status) => status switch
        {
            CatalogStatus.ComingSoon => "coming soon",
            CatalogStatus.OpenForEnrollment => "OPEN for enrollment",
            CatalogStatus.Full => "full (no seats left)",
            CatalogStatus.InProgress => "in progress (enrollment closed)",
            CatalogStatus.Completed => "completed",
            _ => status.ToString()
        };

        private static string Price(decimal price) => price == 0 ? "free" : $"{price:0} EGP";

        private static string Date(DateOnly? date) => date?.ToString("dd MMM yyyy") ?? "TBA";

        private static string Optional(string label, string? value) =>
            string.IsNullOrWhiteSpace(value) ? "" : $" | {label}: {value.Trim()}";

        private static string Shorten(string value, int max)
        {
            var clean = value.Trim();
            return clean.Length <= max ? clean : clean[..max].TrimEnd() + "…";
        }
    }
}
