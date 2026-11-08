import { useState, type FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowLeft, BookOpen, Compass, Home, Layers, Route, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { usePageTitle } from "@/hooks/usePageTitle";

const LINKS = [
  { label: "Home", to: "/", icon: Home },
  { label: "Courses", to: "/courses", icon: BookOpen },
  { label: "Programs", to: "/programs", icon: Layers },
  { label: "Career paths", to: "/career-paths", icon: Route },
];

// 404 in the Andalusian style, with a course search and useful links
function NotFoundPage() {
  usePageTitle("Page not found");
  const navigate = useNavigate();
  const [query, setQuery] = useState("");

  function handleSearch(event: FormEvent) {
    event.preventDefault();
    const term = query.trim();
    navigate(term ? `/courses?q=${encodeURIComponent(term)}` : "/courses");
  }

  return (
    <section className="relative flex flex-1 items-center overflow-hidden py-16">
      <div
        aria-hidden
        className="bg-andalusia-pattern pointer-events-none absolute inset-0 opacity-30 [mask-image:radial-gradient(ellipse_at_center,black,transparent_70%)]"
      />
      <div aria-hidden className="pointer-events-none absolute top-10 left-1/2 size-96 -translate-x-1/2 rounded-full bg-sand/20 blur-3xl" />

      <div className="relative mx-auto flex w-full max-w-2xl flex-col items-center px-4 text-center">
        {/* An arch, like the Alhambra's doorways */}
        <div className="relative flex h-44 w-36 items-end justify-center rounded-t-full border-4 border-sand/60 bg-primary text-primary-foreground shadow-xl shadow-primary/20">
          <div aria-hidden className="bg-andalusia-pattern absolute inset-0 rounded-t-full opacity-20" />
          <Compass aria-hidden className="relative mb-8 size-14 animate-float text-sand" strokeWidth={1.5} />
        </div>
        <p className="mt-8 font-heading text-6xl font-semibold text-sand-deep">404</p>
        <h1 className="mt-2 text-3xl font-semibold text-balance sm:text-4xl">This path leads nowhere</h1>
        <p className="mt-3 max-w-md text-muted-foreground">
          The page you're looking for doesn't exist or has moved. Try searching for a course, or pick a place to continue.
        </p>

        <form onSubmit={handleSearch} role="search" className="mt-8 flex w-full max-w-md gap-2">
          <label htmlFor="notfound-search" className="sr-only">
            Search courses
          </label>
          <div className="relative flex-1">
            <Search aria-hidden className="pointer-events-none absolute top-1/2 left-3.5 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              id="notfound-search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search courses, e.g. React"
              className="h-11 rounded-full bg-card pl-10"
            />
          </div>
          <Button type="submit" size="lg" className="h-11 rounded-full px-5">
            Search
          </Button>
        </form>

        <nav aria-label="Helpful links" className="mt-8 flex flex-wrap justify-center gap-2">
          {LINKS.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-4 py-2 text-sm font-medium transition outline-none hover:-translate-y-0.5 hover:border-sand hover:shadow-sm focus-visible:ring-3 focus-visible:ring-ring/50 motion-reduce:hover:translate-y-0"
            >
              <link.icon aria-hidden className="size-4 text-sand-deep" />
              {link.label}
            </Link>
          ))}
        </nav>

        <button
          type="button"
          onClick={() => navigate(-1)}
          className="mt-6 inline-flex items-center gap-1.5 rounded-sm text-sm font-medium text-sand-deep underline-offset-4 outline-none hover:underline focus-visible:ring-3 focus-visible:ring-ring/50"
        >
          <ArrowLeft aria-hidden className="size-4" /> Go back
        </button>
      </div>
    </section>
  );
}

export default NotFoundPage;
