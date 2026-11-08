namespace Andalusia.Api.Helpers
{
    // Names of the rate limits set up in Program.cs
    public static class RateLimitPolicies
    {
        // Login, register, password reset: 10 tries per minute per IP address
        public const string Auth = "auth";

        // Chatbot: 20 questions per minute per IP address
        public const string Chat = "chat";
    }
}
