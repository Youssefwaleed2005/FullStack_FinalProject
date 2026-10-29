// "" → null: the API's URL / regex validators reject empty strings
export const orNull = (value: string) => value.trim() || null;

// Absolute http(s) link, as the API's [Url] check expects
export function isHttpUrl(value: string): boolean {
  try {
    return ["http:", "https:"].includes(new URL(value).protocol);
  } catch {
    return false;
  }
}
