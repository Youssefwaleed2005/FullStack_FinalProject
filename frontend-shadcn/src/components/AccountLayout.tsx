import type { ReactNode } from "react";
import { NavLink } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { ACCOUNT_LINKS } from "@/lib/navigation";
import { pageContainer } from "@/lib/styles";
import { cn } from "@/lib/utils";

type AccountLayoutProps = {
  title: string;
  description: string;
  children: ReactNode;
};

// Header with tabs between the account pages (learning, applications, payments, profile)
function AccountLayout({ title, description, children }: AccountLayoutProps) {
  const { hasRole } = useAuth();
  const links = ACCOUNT_LINKS.filter(
    (link) => !link.learnerOnly || hasRole("Learner"),
  );

  return (
    <>
      <section className="border-b border-border/70 bg-linear-to-b from-secondary/70 to-background">
        <div className={cn(pageContainer, "pt-12 sm:pt-16")}>
          <p className="text-xs font-semibold tracking-[0.2em] text-sand-deep uppercase">
            My account
          </p>
          <h1 className="mt-3 text-4xl leading-tight font-semibold sm:text-5xl">
            {title}
          </h1>
          <p className="mt-3 max-w-xl text-base text-muted-foreground">
            {description}
          </p>

          {/* Tabs: scroll sideways on small screens */}
          <nav
            aria-label="Account"
            className="-mx-4 mt-8 overflow-x-auto px-4 [scrollbar-width:none] sm:mx-0 sm:px-0 [&::-webkit-scrollbar]:hidden"
          >
            <ul className="flex gap-1">
              {links.map((link) => (
                <li key={link.to}>
                  <NavLink
                    to={link.to}
                    className={({ isActive }) =>
                      cn(
                        "flex items-center gap-2 border-b-2 px-3 pt-2 pb-3 text-sm font-medium whitespace-nowrap transition-colors outline-none focus-visible:ring-3 focus-visible:ring-ring/50",
                        isActive
                          ? "border-primary text-foreground"
                          : "border-transparent text-muted-foreground hover:text-foreground",
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
        </div>
      </section>

      <div className={cn(pageContainer, "max-w-4xl py-10 sm:py-12")}>
        {children}
      </div>
    </>
  );
}

export default AccountLayout;
