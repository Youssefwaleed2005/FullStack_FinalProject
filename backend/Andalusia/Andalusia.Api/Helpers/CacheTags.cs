namespace Andalusia.Api.Helpers
{
    // Output cache: public content that rarely changes (categories, career paths, partners, testimonials, site info).
    // Cached for 5 minutes; any admin change clears it straight away (EvictByTagAsync).
    public static class CacheTags
    {
        public const string PublicContentPolicy = "PublicContent";
        public const string PublicContent = "public-content";
    }
}
