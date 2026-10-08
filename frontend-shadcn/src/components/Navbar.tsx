import { useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { ArrowRight, Menu } from "lucide-react";
import Logo from "@/components/Logo";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { NAV_LINKS } from "@/lib/navigation";
import { cn } from "@/lib/utils";

function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 border-b border-border/70 bg-background/80 backdrop-blur-lg">
      <div className="mx-auto flex h-16 w-full max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
        <Logo />

        {/* Desktop links */}
        <nav aria-label="Main" className="hidden lg:block">
          <ul className="flex items-center gap-1">
            {NAV_LINKS.map((link) => (
              <li key={link.to}>
                <NavLink
                  to={link.to}
                  end={link.to === "/"}
                  className={({ isActive }) =>
                    cn(
                      "rounded-full px-3.5 py-2 text-sm font-medium text-muted-foreground transition-colors outline-none hover:text-foreground focus-visible:ring-3 focus-visible:ring-ring/50",
                      isActive && "bg-secondary text-secondary-foreground",
                    )
                  }
                >
                  {link.label}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>

        <div className="flex items-center gap-2">
          <Button
            asChild
            size="lg"
            className="hidden rounded-full px-4 sm:inline-flex"
          >
            <Link to="/courses">
              Browse courses
              <ArrowRight data-icon="inline-end" />
            </Link>
          </Button>

          {/* Mobile menu: a panel that slides in from the side */}
          <Sheet open={menuOpen} onOpenChange={setMenuOpen}>
            <SheetTrigger asChild>
              <Button
                variant="outline"
                size="icon-lg"
                className="lg:hidden"
                aria-label="Open menu"
              >
                <Menu />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-80 max-w-[85vw]">
              <SheetHeader className="border-b p-5">
                <SheetTitle className="font-heading text-xl">Menu</SheetTitle>
                <SheetDescription>Explore Andalusia Academy</SheetDescription>
              </SheetHeader>
              <nav aria-label="Mobile" className="px-3">
                <ul className="flex flex-col gap-1">
                  {NAV_LINKS.map((link) => (
                    <li key={link.to}>
                      <NavLink
                        to={link.to}
                        end={link.to === "/"}
                        onClick={() => setMenuOpen(false)}
                        className={({ isActive }) =>
                          cn(
                            "block rounded-xl px-4 py-3 text-base font-medium text-muted-foreground transition-colors outline-none hover:bg-muted hover:text-foreground focus-visible:ring-3 focus-visible:ring-ring/50",
                            isActive &&
                              "bg-secondary text-secondary-foreground",
                          )
                        }
                      >
                        {link.label}
                      </NavLink>
                    </li>
                  ))}
                </ul>
              </nav>
              <div className="mt-auto border-t p-5">
                <Button asChild size="lg" className="h-11 w-full rounded-full">
                  <Link to="/courses" onClick={() => setMenuOpen(false)}>
                    Browse courses
                    <ArrowRight data-icon="inline-end" />
                  </Link>
                </Button>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}

export default Navbar;
