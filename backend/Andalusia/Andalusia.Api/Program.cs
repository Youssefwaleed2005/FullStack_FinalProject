using Andalusia.Api.Data;
using Andalusia.Api.Helpers;
using Andalusia.Api.Middleware;
using Andalusia.Api.Repos;
using Andalusia.Api.Repos.Interfaces;
using Andalusia.Api.Services;
using Andalusia.Api.Services.Interfaces;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using System.Text;
using System.Text.Json.Serialization;
using Microsoft.OpenApi;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.OutputCaching;
using System.Threading.RateLimiting;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddControllers()
    .AddJsonOptions(options =>
        options.JsonSerializerOptions.Converters.Add(new JsonStringEnumConverter()))
    // Validation errors use the same shape as every other error:
    // { statusCode: 400, message: "first problem", errors: { "email": "…", "price": "…" } }
    .ConfigureApiBehaviorOptions(options =>
    {
        options.InvalidModelStateResponseFactory = context =>
        {
            var errors = context.ModelState
                .Where(entry => entry.Value?.Errors.Count > 0)
                .ToDictionary(
                    entry => ToFieldName(entry.Key),
                    entry => entry.Value!.Errors[0].ErrorMessage is { Length: > 0 } text
                        ? text
                        : "This value is not valid.");

            var message = errors.Count == 0
                ? "Some fields are not valid."
                : errors.Values.First();

            return new BadRequestObjectResult(new { statusCode = 400, message, errors });
        };
    });

// Limits how often one IP address can call sensitive endpoints (429 when exceeded)
builder.Services.AddRateLimiter(options =>
{
    options.RejectionStatusCode = StatusCodes.Status429TooManyRequests;
    options.OnRejected = async (context, token) =>
    {
        await context.HttpContext.Response.WriteAsJsonAsync(new
        {
            statusCode = 429,
            message = "Too many attempts. Please wait a minute and try again."
        }, token);
    };

    options.AddPolicy(RateLimitPolicies.Auth, http => RateLimitPartition.GetFixedWindowLimiter(
        http.Connection.RemoteIpAddress?.ToString() ?? "unknown",
        _ => new FixedWindowRateLimiterOptions { PermitLimit = 10, Window = TimeSpan.FromMinutes(1), QueueLimit = 0 }));

    options.AddPolicy(RateLimitPolicies.Chat, http => RateLimitPartition.GetFixedWindowLimiter(
        http.Connection.RemoteIpAddress?.ToString() ?? "unknown",
        _ => new FixedWindowRateLimiterOptions { PermitLimit = 20, Window = TimeSpan.FromMinutes(1), QueueLimit = 0 }));
});

// Caches public content for 5 minutes (only for anonymous requests); cleared when an admin changes it
builder.Services.AddOutputCache(options =>
{
    options.AddPolicy(CacheTags.PublicContentPolicy, policy => policy
        .Expire(TimeSpan.FromMinutes(5))
        .SetVaryByQuery("*")
        .Tag(CacheTags.PublicContent));
});

// Swagger
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(options =>
{
    // Adds the "Authorize" button so you can paste a JWT token in Swagger
    options.AddSecurityDefinition("Bearer", new OpenApiSecurityScheme
    {
        Type = SecuritySchemeType.Http,
        Scheme = "bearer",
        BearerFormat = "JWT",
        Description = "Paste your JWT token here (without the word 'Bearer')."
    });

    options.AddSecurityRequirement(document => new OpenApiSecurityRequirement
    {
        [new OpenApiSecuritySchemeReference("Bearer", document)] = []
    });
});

// JWT
builder.Services.Configure<JwtSettings>(builder.Configuration.GetSection("Jwt"));
var jwtSettings = builder.Configuration.GetSection("Jwt").Get<JwtSettings>()!;

builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(options =>
    {
        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuer = true,
            ValidateAudience = true,
            ValidateLifetime = true,
            ValidateIssuerSigningKey = true,
            ValidIssuer = jwtSettings.Issuer,
            ValidAudience = jwtSettings.Audience,
            IssuerSigningKey = new SymmetricSecurityKey(
                Encoding.UTF8.GetBytes(jwtSettings.Secret))
        };
    });

// Repositories and services
builder.Services.AddScoped(typeof(IGenericRepository<>), typeof(GenericRepository<>));
builder.Services.AddScoped<ICategoryRepository, CategoryRepository>();
builder.Services.AddScoped<ICategoryService, CategoryService>();
builder.Services.AddScoped<ICourseRepository, CourseRepository>();
builder.Services.AddScoped<ICourseService, CourseService>();
builder.Services.AddScoped<IProgramRepository, ProgramRepository>();
builder.Services.AddScoped<IProgramService, ProgramService>();
builder.Services.AddScoped<ITestimonialRepository, TestimonialRepository>();
builder.Services.AddScoped<ITestimonialService, TestimonialService>();
builder.Services.AddScoped<IPartnerRepository, PartnerRepository>();
builder.Services.AddScoped<IPartnerService, PartnerService>();
builder.Services.AddScoped<ISiteSettingRepository, SiteSettingRepository>();
builder.Services.AddScoped<ISiteSettingService, SiteSettingService>();
builder.Services.AddScoped<ICareerPathRepository, CareerPathRepository>();
builder.Services.AddScoped<ICareerPathService, CareerPathService>();
builder.Services.AddScoped<IUserRepository, UserRepository>();
builder.Services.AddScoped<ITokenService, TokenService>();
builder.Services.AddScoped<IAuthService, AuthService>();
builder.Services.AddScoped<IApplicationRepository, ApplicationRepository>();
builder.Services.AddScoped<IApplicationService, ApplicationService>();
builder.Services.AddScoped<IPaymentRepository, PaymentRepository>();
builder.Services.AddScoped<IPaymentService, PaymentService>();
builder.Services.AddScoped<IEnrollmentRepository, EnrollmentRepository>();
builder.Services.AddScoped<IEnrollmentService, EnrollmentService>();
builder.Services.AddScoped<IInstructorRepository, InstructorRepository>();
builder.Services.AddScoped<IInstructorService, InstructorService>();
builder.Services.AddScoped<ISessionRepository, SessionRepository>();
builder.Services.AddScoped<ISessionService, SessionService>();
builder.Services.AddScoped<IAttendanceRepository, AttendanceRepository>();
builder.Services.AddScoped<IAttendanceService, AttendanceService>();
builder.Services.AddScoped<IMaterialRepository, MaterialRepository>();
builder.Services.AddScoped<IMaterialService, MaterialService>();
builder.Services.AddScoped<IAssignmentRepository, AssignmentRepository>();
builder.Services.AddScoped<IAssignmentService, AssignmentService>();
builder.Services.AddScoped<IAdminRepository, AdminRepository>();
builder.Services.AddScoped<IAdminService, AdminService>();
builder.Services.AddScoped<ILearnerRepository, LearnerRepository>();
builder.Services.AddScoped<ILearnerService, LearnerService>();

// Chatbot: local Ollama model (free) + the live catalog from our database
builder.Services.Configure<ChatSettings>(builder.Configuration.GetSection("Chat"));
var chatSettings = builder.Configuration.GetSection("Chat").Get<ChatSettings>() ?? new ChatSettings();
builder.Services.AddHttpClient(ChatService.HttpClientName, client =>
{
    client.BaseAddress = new Uri(chatSettings.OllamaUrl);
    client.Timeout = TimeSpan.FromSeconds(chatSettings.TimeoutSeconds);
});
builder.Services.AddScoped<IChatRepository, ChatRepository>();
builder.Services.AddScoped<IChatService, ChatService>();
// DbContext
builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection")));

// CORS
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAll", policy =>
    {
        policy.AllowAnyOrigin()
              .AllowAnyMethod()
              .AllowAnyHeader();
    });
});

var app = builder.Build();

if (app.Environment.IsDevelopment())
{
    using var scope = app.Services.CreateScope();
    var context = scope.ServiceProvider.GetRequiredService<AppDbContext>();
    await context.Database.MigrateAsync();
    await DbSeeder.SeedAsync(context);
    // Runs once per database, existing ones included
    await ReactCourseDemoSeeder.SeedAsync(context);
}

app.UseMiddleware<ExceptionHandlingMiddleware>();

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();

// Serves wwwroot: demo PDFs in /files and instructor uploads in /uploads
app.UseStaticFiles();

app.UseCors("AllowAll");

app.UseRateLimiter();

// After any successful change to public content, clear the cached copies
string[] publicContentPaths = ["/api/categories", "/api/careerpaths", "/api/partners", "/api/testimonials", "/api/site-settings", "/api/courses", "/api/programs"];
app.Use(async (context, next) =>
{
    await next();
    if (!HttpMethods.IsGet(context.Request.Method)
        && context.Response.StatusCode < 400
        && publicContentPaths.Any(p => context.Request.Path.StartsWithSegments(p, StringComparison.OrdinalIgnoreCase)))
    {
        var store = context.RequestServices.GetRequiredService<IOutputCacheStore>();
        await store.EvictByTagAsync(CacheTags.PublicContent, context.RequestAborted);
    }
});

app.UseOutputCache();

app.UseAuthentication();   // must come before UseAuthorization
app.UseAuthorization();

app.MapControllers();

app.MapGet("/api/health", () => Results.Ok(new { status = "Healthy" }));

app.Run();

// "Messages[0].Content" → "messages[0].content", "$.price" → "price"
static string ToFieldName(string key)
{
    var clean = key.StartsWith("$.") ? key[2..] : key;
    if (clean is "" or "$") return "body";
    return string.Join('.', clean.Split('.').Select(part =>
        part.Length == 0 ? part : char.ToLowerInvariant(part[0]) + part[1..]));
}