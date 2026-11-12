namespace Andalusia.Api.Helpers
{
    // "Chat" section in appsettings.json: which local Ollama model answers the chatbot
    public class ChatSettings
    {
        public string OllamaUrl { get; set; } = "http://localhost:11434";
        public string Model { get; set; } = "llama3.2";

        // How much text the model can read at once (the catalog + the conversation)
        public int ContextSize { get; set; } = 8192;

        // Lower = more factual, higher = more creative
        public double Temperature { get; set; } = 0.3;

        public int TimeoutSeconds { get; set; } = 120;

        // How long Ollama keeps the model in memory after the last question (e.g. "30m", "24h")
        public string KeepAlive { get; set; } = "24h";

        // Only the most recent messages of a conversation are sent, so prompts stay short and fast
        public int MaxHistoryMessages { get; set; } = 10;

        // Load the model when the backend starts, so the first question is not slow
        public bool WarmUpOnStartup { get; set; } = true;
    }
}
