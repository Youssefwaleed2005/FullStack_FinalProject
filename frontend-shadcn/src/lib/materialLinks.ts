// "https://localhost:7171/api" → "https://localhost:7171"
const API_ORIGIN = String(import.meta.env.VITE_API_BASE_URL ?? "").replace(/\/api\/?$/, "");

// Files stored on our API ("/files/...", "/uploads/...") need the API address in front
export function resolveMaterialUrl(url: string): string {
  return url.startsWith("/") ? `${API_ORIGIN}${url}` : url;
}

// YouTube watch / short / embed links → embeddable URL (null if not YouTube)
export function getYouTubeEmbedUrl(url: string): string | null {
  const match = url.match(
    /(?:youtube\.com\/(?:watch\?v=|embed\/|shorts\/)|youtu\.be\/)([\w-]{11})/,
  );
  return match ? `https://www.youtube-nocookie.com/embed/${match[1]}` : null;
}

export function isPdf(url: string): boolean {
  return /\.pdf($|\?)/i.test(url);
}

// Can we show it inside the page (PDF viewer / YouTube player)?
export function canPreview(url: string): boolean {
  return isPdf(url) || getYouTubeEmbedUrl(url) !== null;
}
