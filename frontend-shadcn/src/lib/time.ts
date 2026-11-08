// "just now", "5 minutes ago", "3 days ago"… for "last edited" notes
const units: [Intl.RelativeTimeFormatUnit, number][] = [
  ["year", 365 * 24 * 3600],
  ["month", 30 * 24 * 3600],
  ["week", 7 * 24 * 3600],
  ["day", 24 * 3600],
  ["hour", 3600],
  ["minute", 60],
];

const format = new Intl.RelativeTimeFormat("en", { numeric: "auto" });

export function timeAgo(isoDate: string): string {
  const hasZone = /[zZ]|[+-]\d\d:\d\d$/.test(isoDate);
  const date = new Date(isoDate.includes("T") && !hasZone ? `${isoDate}Z` : isoDate);
  const seconds = Math.round((date.getTime() - Date.now()) / 1000);
  for (const [unit, size] of units) {
    if (Math.abs(seconds) >= size) return format.format(Math.round(seconds / size), unit);
  }
  return "just now";
}
