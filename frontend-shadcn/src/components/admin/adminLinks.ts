import { BookOpen, CreditCard, FileText, LayoutDashboard, Users } from "lucide-react";
import type { ManageLink } from "@/components/manage/ManageHeader";

// Tabs shown on every admin page
export const ADMIN_LINKS: ManageLink[] = [
  { label: "Overview", to: "/admin", icon: LayoutDashboard, end: true },
  { label: "Users", to: "/admin/users", icon: Users },
  { label: "Courses", to: "/admin/courses", icon: BookOpen },
  { label: "Content", to: "/admin/content", icon: FileText },
  { label: "Payments", to: "/admin/payments", icon: CreditCard },
];
