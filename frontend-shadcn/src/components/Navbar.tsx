import { useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { ArrowRight, LogOut, Menu } from "lucide-react";
import Avatar from "@/components/Avatar";
import Logo from "@/components/Logo";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { useAuth } from "@/hooks/useAuth";
import { ACCOUNT_LINKS, NAV_LINKS } from "@/lib/navigation";
import { cn } from "@/lib/utils";

const mobileLinkStyle =
  "flex items-center gap-3 rounded-xl px-4 py-3 text-base font-medium text-muted-foreground transition-colors outline-none hover:bg-muted hover:text-foreground focus-visible:ring-3 focus-visible:ring-ring/50";

function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const { user, logout, hasRole } = useAuth();
  const navigate = useNavigate();

  const fullName = user ? `${user.firstName} ${user.lastName}` : "";
  const accountLinks = ACCOUNT_LINKS.filter(
    (link) => !link.learnerOnly || hasRole("Learner"),
  );

  function handleLogout() {
    setMenuOpen(false);
    logout();
    navigate("/");
  }

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
          {user ? (
            // Account menu
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button
                  type="button"
                  aria-label="Account menu"
                  className="hidden rounded-full outline-none focus-visible:ring-3 focus-visible:ring-ring/50 sm:block"
                >
                  <Avatar
                    name={fullName}
                    className="size-9 bg-primary text-sand transition-transform hover:scale-105"
                  />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-60 p-1.5">
                <DropdownMenuLabel className="px-2 py-2">
                  <span className="block truncate text-sm font-semibold text-foreground">
                    {fullName}
                  </span>
                  <span className="block truncate text-xs font-normal text-muted-foreground">
                    {user.email}
                  </span>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                {accountLinks.map((link) => (
                  <DropdownMenuItem key={link.to} asChild className="px-2 py-2">
                    <Link to={link.to}>
                      <link.icon aria-hidden />
                      {link.label}
                    </Link>
                  </DropdownMenuItem>
                ))}
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  variant="destructive"
                  onSelect={handleLogout}
                  className="px-2 py-2"
                >
                  <LogOut aria-hidden />
                  Log out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <>
              <Button
                asChild
                variant="ghost"
                size="lg"
                className="hidden rounded-full px-4 sm:inline-flex"
              >
                <Link to="/login">Log in</Link>
              </Button>
              <Button
                asChild
                size="lg"
                className="hidden rounded-full px-4 sm:inline-flex"
              >
                <Link to="/register">
                  Sign up
                  <ArrowRight data-icon="inline-end" />
                </Link>
              </Button>
            </>
          )}

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
            <SheetContent side="right" className="w-80 max-w-[85vw] gap-0">
              <SheetHeader className="border-b p-5">
                <SheetTitle className="font-heading text-xl">Menu</SheetTitle>
                <SheetDescription>Explore Andalusia Academy</SheetDescription>
              </SheetHeader>

              <div className="flex-1 overflow-y-auto px-3 py-4">
                <nav aria-label="Mobile">
                  <ul className="flex flex-col gap-1">
                    {NAV_LINKS.map((link) => (
                      <li key={link.to}>
                        <NavLink
                          to={link.to}
                          end={link.to === "/"}
                          onClick={() => setMenuOpen(false)}
                          className={({ isActive }) =>
                            cn(
                              mobileLinkStyle,
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

                {user && (
                  <nav aria-label="Account" className="mt-4 border-t pt-4">
                    <div className="flex items-center gap-3 px-4 pb-3">
                      <Avatar name={fullName} className="size-10 bg-primary text-sand" />
                      <span className="min-w-0">
                        <span className="block truncate text-sm font-semibold">
                          {fullName}
                        </span>
                        <span className="block truncate text-xs text-muted-foreground">
                          {user.email}
                        </span>
                      </span>
                    </div>
                    <ul className="flex flex-col gap-1">
                      {accountLinks.map((link) => (
                        <li key={link.to}>
                          <NavLink
                            to={link.to}
                            onClick={() => setMenuOpen(false)}
                            className={({ isActive }) =>
                              cn(
                                mobileLinkStyle,
                                isActive && "bg-secondary text-secondary-foreground",
                              )
                            }
                          >
                            <link.icon aria-hidden className="size-4.5" />
                            {link.label}
                          </NavLink>
                        </li>
                      ))}
                    </ul>
                  </nav>
                )}
              </div>

              <div className="border-t p-5">
                {user ? (
                  <Button
                    size="lg"
                    variant="outline"
                    className="h-11 w-full rounded-full"
                    onClick={handleLogout}
                  >
                    <LogOut data-icon="inline-start" />
                    Log out
                  </Button>
                ) : (
                  <div className="grid gap-2">
                    <Button asChild size="lg" className="h-11 w-full rounded-full">
                      <Link to="/register" onClick={() => setMenuOpen(false)}>
                        Sign up
                        <ArrowRight data-icon="inline-end" />
                      </Link>
                    </Button>
                    <Button
                      asChild
                      size="lg"
                      variant="outline"
                      className="h-11 w-full rounded-full"
                    >
                      <Link to="/login" onClick={() => setMenuOpen(false)}>
                        Log in
                      </Link>
                    </Button>
                  </div>
                )}
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}

export default Navbar;
