import { useEffect, useState } from "react";
import { prefersReducedMotion } from "@/lib/confetti";

type CountUpProps = {
  value: number;
  suffix?: string;
  duration?: number; // ms
};

// Counts from 0 up to the value (ease-out), e.g. 0 → 70%
function CountUp({ value, suffix = "", duration = 900 }: CountUpProps) {
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    const instant = prefersReducedMotion();
    const start = performance.now();
    let frame = 0;

    const step = (now: number) => {
      const progress = instant ? 1 : Math.min(1, (now - start) / duration);
      const eased = 1 - Math.pow(1 - progress, 3);
      setDisplay(Math.round(value * eased));
      if (progress < 1) frame = requestAnimationFrame(step);
    };

    frame = requestAnimationFrame(step);
    return () => cancelAnimationFrame(frame);
  }, [value, duration]);

  return (
    <span className="tabular-nums">
      {display}
      {suffix}
    </span>
  );
}

export default CountUp;
