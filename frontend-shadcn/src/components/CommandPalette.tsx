import { useEffect, useMemo, useRef, useState, type KeyboardEvent } from "react";
import { useNavigate } from "react-router-dom";
import { BookOpen, CornerDownLeft, Layers, LoaderCircle, Route, Search, type LucideIcon } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogTitle } from "@/components/ui/dialog";
import { formatPrice } from "@/lib/course";
import { cn } from "@/lib/utils";
import { getCareerPaths } from "@/services/careerPathService";
import { getCourses } from "@/services/courseService";
import { getPrograms } from "@/services/programService";

type Result = {
  key: string;
  kind: "Course" | "Program" | "Career path";
  title: string;
  detail: string;
  to: string;
  icon: LucideIcon;
};

// Everything searchable, loaded once the first time the palette opens
async function loadIndex(): Promise<Result[]> {
  const [courses, programs, paths] = await Promise.all([
    getCourses({ pageSize: 50 }),
    getPrograms({ pageSize: 50 }),
    getCareerPaths(),
  ]);
  return [
    ...courses.items.map((c) => ({
      key: `course-${c.id}`,
      kind: "Course" as const,
      title: c.title,
      detail: `${c.categoryName} · ${formatPrice(c.price)}`,
      to: `/courses/${c.id}`,
      icon: BookOpen,
    })),
    ...programs.items.map((p) => ({
      key: `program-${p.id}`,
      kind: "Program" as const,
      title: p.title,
      detail: `Program · ${formatPrice(p.price)}`,
      to: `/programs/${p.id}`,
      icon: Layers,
    })),
    ...paths.map((cp) => ({
      key: `path-${cp.id}`,
      kind: "Career path" as const,
      title: cp.title,
      detail: cp.shortDescription ?? "Career path",
      to: `/career-paths/${cp.id}`,
      icon: Route,
    })),
  ];
}

type CommandPaletteProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

// Ctrl+K / ⌘K search across courses, programs and career paths
function CommandPalette({ open, onOpenChange }: CommandPaletteProps) {
  const navigate = useNavigate();
  const [index, setIndex] = useState<Result[] | null>(null);
  const [failed, setFailed] = useState(false);
  const [query, setQuery] = useState("");
  const [active, setActive] = useState(0);
  const listRef = useRef<HTMLUListElement>(null);

  useEffect(() => {
    if (!open || index) return;
    let cancelled = false;
    loadIndex()
      .then((data) => {
        if (!cancelled) setIndex(data);
      })
      .catch(() => {
        if (!cancelled) setFailed(true);
      });
    return () => {
      cancelled = true;
    };
  }, [open, index]);

  const results = useMemo(() => {
    if (!index) return [];
    const words = query.toLowerCase().split(/\s+/).filter(Boolean);
    const matches = words.length
      ? index.filter((r) => words.every((w) => `${r.title} ${r.detail} ${r.kind}`.toLowerCase().includes(w)))
      : index.filter((r) => r.kind !== "Course").concat(index.filter((r) => r.kind === "Course"));
    return matches.slice(0, 12);
  }, [index, query]);

  function go(result: Result | undefined) {
    if (!result) return;
    onOpenChange(false);
    setQuery("");
    navigate(result.to);
  }

  function handleKeyDown(event: KeyboardEvent<HTMLInputElement>) {
    if (event.key === "ArrowDown" || event.key === "ArrowUp") {
      event.preventDefault();
      const next = event.key === "ArrowDown"
        ? Math.min(active + 1, results.length - 1)
        : Math.max(active - 1, 0);
      setActive(next);
      listRef.current?.children[next]?.scrollIntoView({ block: "nearest" });
    } else if (event.key === "Enter") {
      event.preventDefault();
      go(results[active]);
    }
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(next) => {
        onOpenChange(next);
        if (!next) setQuery("");
      }}
    >
      <DialogContent showCloseButton={false} className="top-[15%] translate-y-0 gap-0 overflow-hidden p-0 sm:max-w-xl">
        <DialogTitle className="sr-only">Search the academy</DialogTitle>
        <DialogDescription className="sr-only">
          Type to find courses, programs and career paths. Use the arrow keys and Enter to open one.
        </DialogDescription>
        <div className="flex items-center gap-3 border-b border-border/70 px-4">
          <Search aria-hidden className="size-5 shrink-0 text-muted-foreground" />
          <input
            autoFocus
            role="combobox"
            aria-expanded
            aria-controls="palette-results"
            aria-activedescendant={results[active] ? `palette-${results[active].key}` : undefined}
            aria-label="Search courses, programs and career paths"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setActive(0);
            }}
            onKeyDown={handleKeyDown}
            placeholder="Search courses, programs, career paths…"
            className="h-14 flex-1 bg-transparent text-base outline-none placeholder:text-muted-foreground"
          />
          <kbd className="hidden rounded-md border border-border bg-muted px-1.5 py-0.5 text-[0.7rem] text-muted-foreground sm:block">Esc</kbd>
        </div>

        <div className="max-h-[min(24rem,60svh)] overflow-y-auto p-2">
          {!index && !failed && (
            <p className="flex items-center justify-center gap-2 py-10 text-sm text-muted-foreground">
              <LoaderCircle aria-hidden className="size-4 animate-spin" /> Loading…
            </p>
          )}
          {failed && <p className="py-10 text-center text-sm text-muted-foreground">Search is unavailable right now.</p>}
          {index && results.length === 0 && (
            <p className="py-10 text-center text-sm text-muted-foreground">No results for "{query}".</p>
          )}
          {results.length > 0 && (
            <ul id="palette-results" role="listbox" ref={listRef} aria-label="Results">
              {results.map((result, i) => (
                <li
                  key={result.key}
                  id={`palette-${result.key}`}
                  role="option"
                  aria-selected={i === active}
                  onMouseEnter={() => setActive(i)}
                  onClick={() => go(result)}
                  className={cn(
                    "flex cursor-pointer items-center gap-3 rounded-lg px-3 py-2.5",
                    i === active ? "bg-secondary" : "",
                  )}
                >
                  <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-sand/15 text-sand-deep">
                    <result.icon aria-hidden className="size-4.5" />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-sm font-medium">{result.title}</span>
                    <span className="block truncate text-xs text-muted-foreground">{result.detail}</span>
                  </span>
                  <span className="text-[0.7rem] font-medium tracking-wide text-muted-foreground uppercase">{result.kind}</span>
                  {i === active && <CornerDownLeft aria-hidden className="size-4 text-muted-foreground" />}
                </li>
              ))}
            </ul>
          )}
        </div>
        <div className="flex items-center gap-4 border-t border-border/70 bg-muted/40 px-4 py-2 text-xs text-muted-foreground">
          <span>↑↓ to move</span>
          <span>Enter to open</span>
          <span className="ml-auto">Ctrl K to open anywhere</span>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default CommandPalette;
