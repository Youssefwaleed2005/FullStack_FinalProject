import { useEffect, useState } from "react";

type RotatingWordProps = {
  words: string[];
  interval?: number; // ms
};

// Cycles through words with a soft blur-in, e.g. "developer" → "data analyst" → …
function RotatingWord({ words, interval = 2600 }: RotatingWordProps) {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const id = window.setInterval(() => setIndex((i) => (i + 1) % words.length), interval);
    return () => window.clearInterval(id);
  }, [words.length, interval]);

  return (
    <span className="relative inline-block">
      {/* Screen readers get the full list once instead of a changing word */}
      <span className="sr-only">{words.join(", ")}</span>
      <span key={index} aria-hidden className="inline-block animate-word text-gradient-sand">
        {words[index]}
      </span>
    </span>
  );
}

export default RotatingWord;
