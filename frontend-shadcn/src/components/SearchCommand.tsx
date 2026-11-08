import { useEffect, useState } from "react";
import { Search } from "lucide-react";
import CommandPalette from "@/components/CommandPalette";

// Navbar search button + the Ctrl+K / ⌘K shortcut
function SearchCommand() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        setOpen((value) => !value);
      }
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-label="Search (Ctrl+K)"
        className="flex h-9 items-center gap-2 rounded-full border border-border bg-card px-2.5 text-sm text-muted-foreground transition outline-none hover:text-foreground focus-visible:ring-3 focus-visible:ring-ring/50 xl:w-44 xl:px-3"
      >
        <Search aria-hidden className="size-4" />
        <span className="hidden xl:inline">Search…</span>
        <kbd className="ml-auto hidden rounded border border-border bg-muted px-1.5 text-[0.65rem] xl:inline">Ctrl K</kbd>
      </button>
      <CommandPalette open={open} onOpenChange={setOpen} />
    </>
  );
}

export default SearchCommand;
