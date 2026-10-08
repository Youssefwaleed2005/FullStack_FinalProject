import { Outlet } from "react-router-dom";
import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";

// Shared frame for every page: navbar on top, footer at the bottom, the page in between
function Layout() {
  return (
    <div className="flex min-h-svh flex-col">
      {/* Lets keyboard users jump past the navbar; only visible when focused */}
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-50 focus:rounded-lg focus:bg-primary focus:px-4 focus:py-2 focus:text-sm focus:font-medium focus:text-primary-foreground"
      >
        Skip to content
      </a>
      <Navbar />
      <main id="main" className="flex flex-1 flex-col">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}

export default Layout;
