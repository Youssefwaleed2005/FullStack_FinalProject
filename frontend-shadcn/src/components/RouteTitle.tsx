import { useLocation } from "react-router-dom";
import { usePageTitle } from "@/hooks/usePageTitle";

// Titles for pages whose name is known from the URL alone.
// Detail pages (a course, a program…) set their own title once their data has loaded.
const STATIC_TITLES: Record<string, string | null> = {
  "/": null,
  "/courses": "Courses",
  "/programs": "Programs",
  "/career-paths": "Career paths",
  "/about": "About us",
  "/contact": "Contact",
  "/login": "Log in",
  "/register": "Sign up",
  "/profile": "My profile",
  "/saved": "Saved courses",
  "/compare": "Compare courses",
  "/quiz": "Help me choose",
  "/forgot-password": "Forgot password",
  "/reset-password": "Reset password",
  "/applications": "My applications",
  "/learning": "My dashboard",
  "/calendar": "My calendar",
  "/my-enrollments": "My learning",
  "/my-payments": "My payments",
  "/instructor": "Instructor dashboard",
  "/admin": "Admin overview",
  "/admin/users": "Manage users",
  "/admin/courses": "Manage courses",
  "/admin/content": "Website content",
  "/admin/payments": "Payments",
};

function RouteTitle() {
  const { pathname } = useLocation();
  const path = pathname.length > 1 ? pathname.replace(/\/$/, "") : pathname;
  // undefined = not a static page, so the page itself decides
  usePageTitle(path in STATIC_TITLES ? STATIC_TITLES[path] : undefined);
  return null;
}

export default RouteTitle;
