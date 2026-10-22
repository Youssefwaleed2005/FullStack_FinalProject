import type { ReactNode } from "react";
import { NavLink } from "react-router-dom";
import type { LucideIcon } from "lucide-react";
import { pageContainer } from "@/lib/styles";
import { cn } from "@/lib/utils";

export type ManageLink = { label: string; to: string; icon: LucideIcon; end?: boolean };

type ManageHeaderProps = {
  eyebrow: string;
  title: string;
  description?: string;
  // Buttons on the right, e.g. "New course"
  actions?: ReactNode;
  // Optional tabs under the title (admin area)
  links?: ManageLink[];
  // Extra content under the description, e.g. badges
  children?: ReactNode;
};

// Dark banner at the top of the instructor and admin pages
function ManageHeader({
  eyebrow,
  title,
  description,
  actions,
  links,
  children,
}: ManageHeaderProps) {
  return (
    <section className="relative overflow-hidden bg-primary text-primary-foreground">
      <div
        aria-hidden
        className="bg-andalusia-pattern pointer-events-none absolute inset-0 opacity-15 [mask-image:linear-gradient(to_left,black,transparent_80%)]"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -top-24 right-10 size-80 rounded-full bg-sand/25 blur-3xl"
      />
      <div className={cn(pageContainer, "relative pt-10 sm:pt-14", links ? "pb-0" : "pb-10 sm:pb-12")}>
        <div className="flex flex-wrap items-end justify-between gap-5">
          <div className="max-w-2xl">
            <p className="text-xs font-semibold tracking-[0.2em] text-sand uppercase">
              {eyebrow}
            </p>
            <h1 className="mt-3 text-3xl leading-tight font-semibold text-balance sm:text-4xl">
              {title}
            </h1>
            {description && (
              <p className="mt-3 text-base text-primary-foreground/70">{description}</p>
            )}
            {children}
          </div>
          {actions && <div className="flex flex-wrap gap-2">{actions}</div>}
        </div>

        {links && (
          <nav
            aria-label={`${eyebrow} sections`}
            className="-mx-4 mt-8 overflow-x-auto px-4 [scrollbar-width:none] sm:mx-0 sm:px-0 [&::-webkit-scrollbar]:hidden"
          >
            <ul className="flex gap-1">
              {links.map((link) => (
                <li key={link.to}>
                  <NavLink
                    to={link.to}
                    end={link.end}
                    className={({ isActive }) =>
                      cn(
                        "flex items-center gap-2 rounded-t-xl px-4 pt-2.5 pb-3 text-sm font-medium whitespace-nowrap transition-colors outline-none focus-visible:ring-3 focus-visible:ring-sand/60",
                        isActive
                          ? "bg-background text-foreground"
                          : "text-primary-foreground/70 hover:bg-primary-foreground/10 hover:text-primary-foreground",
                      )
                    }
                  >
                    <link.icon aria-hidden className="size-4" />
                    {link.label}
                  </NavLink>
                </li>
              ))}
            </ul>
          </nav>
        )}
      </div>
    </section>
  );
}

export default ManageHeader;
