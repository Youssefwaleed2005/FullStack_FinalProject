import { useEffect, useState } from "react";

// One timer that steps through `count` items every `interval` ms, e.g. the hero's rotating career path.
// Share the returned index instead of starting a second timer, so everything that reads it stays in sync.
export function useRotatingIndex(count: number, interval: number, paused = false): number {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (paused || count < 2) return;
    const id = window.setInterval(() => setIndex((i) => (i + 1) % count), interval);
    return () => window.clearInterval(id);
  }, [count, interval, paused]);

  // The list can shrink (e.g. fallback words → loaded paths), so keep the index in range
  return count > 0 ? index % count : 0;
}
