type RotatingWordProps = {
  words: string[];
  // Which word to show. The parent owns the timer (useRotatingIndex), so other parts can follow it.
  index: number;
};

// Shows one of the words with a soft blur-in, e.g. "developer" → "data analyst" → …
function RotatingWord({ words, index }: RotatingWordProps) {
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
