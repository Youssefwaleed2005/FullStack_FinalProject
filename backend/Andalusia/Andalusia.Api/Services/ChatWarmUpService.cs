using Andalusia.Api.Helpers;
using Andalusia.Api.Services.Interfaces;
using Microsoft.Extensions.Options;

namespace Andalusia.Api.Services
{
    // Runs once in the background when the backend starts: asks Ollama a tiny question so the
    // model is already in memory before the first visitor opens the chat. If Ollama is not running
    // yet it tries again a few times (e.g. when Ollama is started after the backend).
    public class ChatWarmUpService : BackgroundService
    {
        private const int MaxAttempts = 10;
        private static readonly TimeSpan RetryDelay = TimeSpan.FromSeconds(30);

        private readonly IServiceScopeFactory _scopeFactory;
        private readonly ChatSettings _settings;
        private readonly ILogger<ChatWarmUpService> _logger;

        public ChatWarmUpService(
            IServiceScopeFactory scopeFactory, IOptions<ChatSettings> settings, ILogger<ChatWarmUpService> logger)
        {
            _scopeFactory = scopeFactory;
            _settings = settings.Value;
            _logger = logger;
        }

        protected override async Task ExecuteAsync(CancellationToken stoppingToken)
        {
            if (!_settings.WarmUpOnStartup)
                return;

            // Let the app finish starting first
            await Task.Delay(TimeSpan.FromSeconds(3), stoppingToken);

            for (var attempt = 1; attempt <= MaxAttempts && !stoppingToken.IsCancellationRequested; attempt++)
            {
                try
                {
                    using var scope = _scopeFactory.CreateScope();
                    var chat = scope.ServiceProvider.GetRequiredService<IChatService>();

                    _logger.LogInformation("Warming up the chatbot model ({Model})...", _settings.Model);
                    if (await chat.WarmUpAsync(stoppingToken))
                    {
                        _logger.LogInformation("Chatbot model is loaded and ready.");
                        return;
                    }
                }
                catch (OperationCanceledException) when (stoppingToken.IsCancellationRequested)
                {
                    return;
                }
                catch (Exception ex)
                {
                    _logger.LogWarning(ex, "Chatbot warm-up failed");
                }

                _logger.LogInformation("Ollama is not ready yet; trying the warm-up again in {Seconds}s.", RetryDelay.TotalSeconds);
                try
                {
                    await Task.Delay(RetryDelay, stoppingToken);
                }
                catch (OperationCanceledException)
                {
                    return;
                }
            }
        }
    }
}
