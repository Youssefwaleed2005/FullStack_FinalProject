namespace Andalusia.Api.Exceptions
{
    // An outside service we depend on (e.g. the chatbot's Ollama model) is not reachable → 503
    public class ServiceUnavailableException : Exception
    {
        public ServiceUnavailableException(string message) : base(message) { }
    }
}
