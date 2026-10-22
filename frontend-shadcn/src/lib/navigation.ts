import {
  BookOpen,
  CreditCard,
  FileText,
  LayoutDashboard,
  Presentation,
  ShieldCheck,
  UserRound,
} from "lucide-react";

// Shared by the navbar and the footer
export const NAV_LINKS = [
  { label: "Home", to: "/" },
  { label: "Courses", to: "/courses" },
  { label: "Programs", to: "/programs" },
  { label: "Career Paths", to: "/career-paths" },
  { label: "About", to: "/about" },
  { label: "Contact", to: "/contact" },
] as const;

// Pages of the signed-in user's account (navbar menu and account tabs).
// A link with a role is only shown to users who have that role.
export const ACCOUNT_LINKS = [
  { label: "Dashboard", to: "/learning", icon: LayoutDashboard, role: "Learner" },
  { label: "My learning", to: "/my-enrollments", icon: BookOpen, role: "Learner" },
  { label: "My applications", to: "/applications", icon: FileText, role: "Learner" },
  { label: "My payments", to: "/my-payments", icon: CreditCard, role: "Learner" },
  { label: "Instructor dashboard", to: "/instructor", icon: Presentation, role: "Instructor" },
  { label: "Admin dashboard", to: "/admin", icon: ShieldCheck, role: "Admin" },
  { label: "My profile", to: "/profile", icon: UserRound, role: null },
] as const;

// Where each role lands after signing in
export function homeForRoles(roles: string[]): string {
  if (roles.includes("Admin")) return "/admin";
  if (roles.includes("Instructor")) return "/instructor";
  if (roles.includes("Learner")) return "/learning";
  return "/profile";
}
