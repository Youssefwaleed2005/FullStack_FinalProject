import { useEffect, useState } from "react";
import { Search, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

const DEBOUNCE_MS = 400;

type SearchInputProps = {
  // The committed search term (from the URL)
  value: string;
  onSearch: (value: string) => void;
  placeholder?: string;
  className?: string;
};

// Debounced search box: it waits until the user pauses typing before calling onSearch,
// so we send one request per pause instead of one per keystroke.
function SearchInput({
  value,
  onSearch,
  placeholder = "Search",
  className,
}: SearchInputProps) {
  const [text, setText] = useState(value);

  // When the committed value changes from outside (Clear all, back button), show it in the box
  const [syncedValue, setSyncedValue] = useState(value);
  if (value !== syncedValue) {
    setSyncedValue(value);
    if (value !== text.trim()) setText(value);
  }

  useEffect(() => {
    const trimmed = text.trim();
    if (trimmed === value) return;

    // Every new keystroke cancels the previous timer and starts a fresh one
    const timer = setTimeout(() => onSearch(trimmed), DEBOUNCE_MS);
    return () => clearTimeout(timer);
  }, [text, value, onSearch]);

  function handleClear() {
    setText("");
    onSearch("");
  }

  return (
    <div role="search" className={cn("relative", className)}>
      <Search
        aria-hidden
        className="pointer-events-none absolute top-1/2 left-4 size-4.5 -translate-y-1/2 text-muted-foreground"
      />
      <Input
        type="text"
        inputMode="search"
        aria-label={placeholder}
        placeholder={placeholder}
        value={text}
        onChange={(event) => setText(event.target.value)}
        onKeyDown={(event) => {
          if (event.key === "Escape" && text) handleClear();
        }}
        className="h-12 rounded-full border-border bg-card pr-12 pl-11 text-base shadow-sm md:text-base"
      />
      {text && (
        <button
          type="button"
          onClick={handleClear}
          aria-label="Clear search"
          className="absolute top-1/2 right-3 flex size-7 -translate-y-1/2 items-center justify-center rounded-full text-muted-foreground transition-colors outline-none hover:bg-muted hover:text-foreground focus-visible:ring-3 focus-visible:ring-ring/50"
        >
          <X className="size-4" />
        </button>
      )}
    </div>
  );
}

export default SearchInput;
