import {
  BookOpenCheck,
  CalendarCheck,
  Footprints,
  Layers,
  Rocket,
  Send,
  Star,
  Trophy,
  type LucideIcon,
} from "lucide-react";
import type { LearnerDashboard, LearnerProgress } from "@/types/Learner";

export type Badge = {
  id: string;
  title: string;
  description: string;
  icon: LucideIcon;
  earned: boolean;
};

// Badges across all courses (learner dashboard)
export function getDashboardBadges(dashboard: LearnerDashboard): Badge[] {
  const courses = dashboard.courses;
  return [
    {
      id: "first-step",
      title: "First step",
      description: "Make progress in any course",
      icon: Footprints,
      earned: courses.some((c) => c.progressPercent > 0),
    },
    {
      id: "halfway",
      title: "Halfway there",
      description: "Reach 50% in a course",
      icon: Rocket,
      earned: courses.some((c) => c.progressPercent >= 50),
    },
    {
      id: "champion",
      title: "Course champion",
      description: "Finish a course (100%)",
      icon: Trophy,
      earned: courses.some((c) => c.progressPercent >= 100),
    },
    {
      id: "on-top",
      title: "On top of it",
      description: "No assignments waiting to be submitted",
      icon: Send,
      earned: dashboard.activeCourseCount > 0 && dashboard.pendingAssignmentCount === 0,
    },
    {
      id: "explorer",
      title: "Explorer",
      description: "Be enrolled in 2 or more courses",
      icon: Layers,
      earned: courses.length >= 2,
    },
  ];
}

// Badges for one course (course learning page)
export function getCourseBadges(progress: LearnerProgress): Badge[] {
  return [
    {
      id: "attendance",
      title: "Perfect attendance",
      description: "Attend every session so far",
      icon: CalendarCheck,
      earned: progress.pastSessions > 0 && progress.attendedSessions === progress.pastSessions,
    },
    {
      id: "bookworm",
      title: "Bookworm",
      description: "Finish every material",
      icon: BookOpenCheck,
      earned: progress.totalMaterials > 0 && progress.completedMaterials === progress.totalMaterials,
    },
    {
      id: "all-in",
      title: "All in",
      description: "Submit every assignment",
      icon: Send,
      earned:
        progress.totalAssignments > 0 &&
        progress.submittedAssignments === progress.totalAssignments,
    },
    {
      id: "high-achiever",
      title: "High achiever",
      description: "Average score of 85% or more",
      icon: Star,
      earned: (progress.averageScore ?? 0) >= 85,
    },
    {
      id: "finisher",
      title: "Finisher",
      description: "Reach 100% progress",
      icon: Trophy,
      earned: progress.progressPercent >= 100,
    },
  ];
}
