import { BookOpen, CreditCard, FileText, UserRound } from "lucide-react";

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
// learnerOnly pages are hidden from other roles, e.g. admins.
export const ACCOUNT_LINKS = [
  { label: "My learning", to: "/my-enrollments", icon: BookOpen, learnerOnly: true },
  { label: "My applications", to: "/applications", icon: FileText, learnerOnly: true },
  { label: "My payments", to: "/my-payments", icon: CreditCard, learnerOnly: true },
  { label: "My profile", to: "/profile", icon: UserRound, learnerOnly: false },
] as const;
