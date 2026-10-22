import { Outlet, useLocation } from "react-router-dom";
import Footer from "@/components/Footer";
import BackToTop from "@/components/fun/BackToTop";
import ScrollProgress from "@/components/fun/ScrollProgress";
import Navbar from "@/components/Navbar";

// Shared frame for every page: navbar on top, footer at the bottom, the page in between
function Layout() {
  const { pathname } = useLocation();

  return (
    <div className="flex min-h-svh flex-col">
      {/* Lets keyboard users jump past the navbar; only visible when focused */}
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-50 focus:rounded-lg focus:bg-primary focus:px-4 focus:py-2 focus:text-sm focus:font-medium focus:text-primary-foreground"
      >
        Skip to content
      </a>
      <ScrollProgress />
      <Navbar />
      <main id="main" className="flex flex-1 flex-col">
        {/* New key per page = a soft fade/slide in on every navigation */}
        <div
          key={pathname}
          className="flex flex-1 flex-col duration-500 animate-in fade-in slide-in-from-bottom-2 motion-reduce:animate-none"
        >
          <Outlet />
        </div>
      </main>
      <Footer />
      <BackToTop />
    </div>
  );
}

export default Layout;
