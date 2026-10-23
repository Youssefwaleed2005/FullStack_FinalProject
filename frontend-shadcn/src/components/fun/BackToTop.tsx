import { useEffect, useState } from "react";
import { ArrowUp } from "lucide-react";
import { prefersReducedMotion } from "@/lib/confetti";
import { cn } from "@/lib/utils";

// Round button in the bottom-right corner that appears after scrolling down a bit
function BackToTop() {
  const [show, setShow] = useState(() => window.scrollY > 600);

  useEffect(() => {
    const update = () => setShow(window.scrollY > 600);
    window.addEventListener("scroll", update, { passive: true });
    return () => window.removeEventListener("scroll", update);
  }, []);

  return (
    <button
      type="button"
      aria-label="Back to top"
      tabIndex={show ? 0 : -1}
      onClick={() =>
        window.scrollTo({ top: 0, behavior: prefersReducedMotion() ? "auto" : "smooth" })
      }
      className={cn(
        "fixed right-5 bottom-24 z-40 flex size-12 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-lg shadow-primary/25 transition duration-300 outline-none hover:-translate-y-1 hover:bg-primary/90 focus-visible:ring-3 focus-visible:ring-ring/50",
        show ? "translate-y-0 opacity-100" : "pointer-events-none translate-y-4 opacity-0",
      )}
    >
      <ArrowUp className="size-5" />
    </button>
  );
}

export default BackToTop;
