import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

type AuthLayoutProps = {
  title: string;
  description: string;
  // The "Don't have an account?" line under the form
  footer: ReactNode;
  children: ReactNode;
  className?: string;
};

// Centered card on a soft background, used by the login and register pages
function AuthLayout({
  title,
  description,
  footer,
  children,
  className,
}: AuthLayoutProps) {
  return (
    <div className="relative flex flex-1 items-center justify-center overflow-hidden bg-linear-to-b from-secondary/70 to-background px-4 py-14 sm:py-20">
      <div
        aria-hidden
        className="pointer-events-none absolute -top-32 -left-24 size-112 rounded-full bg-sand/20 blur-3xl"
      />
      <div
        className={cn(
          "relative w-full max-w-md rounded-3xl border border-border/80 bg-card p-6 shadow-xl shadow-primary/5 sm:p-9",
          className,
        )}
      >
        <h1 className="text-3xl font-semibold">{title}</h1>
        <p className="mt-2 text-sm text-muted-foreground">{description}</p>
        <div className="mt-7">{children}</div>
        <p className="mt-7 text-center text-sm text-muted-foreground">
          {footer}
        </p>
      </div>
    </div>
  );
}

export default AuthLayout;
