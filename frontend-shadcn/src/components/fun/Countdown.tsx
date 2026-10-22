import { useEffect, useState } from "react";

// The API sends UTC times without "Z" — add it so the browser converts to local time
function parseApiDate(value: string): number {
  const hasZone = /[zZ]|[+-]\d\d:\d\d$/.test(value);
  return new Date(value.includes("T") && !hasZone ? `${value}Z` : value).getTime();
}

// Live "2d 04h 13m 09s" boxes until a session starts
function Countdown({ target }: { target: string }) {
  const [now, setNow] = useState(() => Date.now());

  useEffect(() => {
    const id = window.setInterval(() => setNow(Date.now()), 1000);
    return () => window.clearInterval(id);
  }, []);

  const diff = parseApiDate(target) - now;
  if (diff <= 0) {
    return <p className="font-semibold text-emerald-700">Starting now — see you there!</p>;
  }

  const total = Math.floor(diff / 1000);
  const parts = [
    { label: "days", value: Math.floor(total / 86400) },
    { label: "hrs", value: Math.floor((total % 86400) / 3600) },
    { label: "min", value: Math.floor((total % 3600) / 60) },
    { label: "sec", value: total % 60 },
  ];

  return (
    <div className="flex gap-2" aria-label="Time until the session starts">
      {parts.map((part) => (
        <div
          key={part.label}
          className="flex min-w-14 flex-col items-center rounded-xl bg-primary-foreground/10 px-2 py-1.5"
        >
          <span className="font-heading text-2xl font-semibold tabular-nums">
            {String(part.value).padStart(2, "0")}
          </span>
          <span className="text-[10px] tracking-wider uppercase opacity-75">{part.label}</span>
        </div>
      ))}
    </div>
  );
}

export default Countdown;
