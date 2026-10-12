import type { Course } from "@/types/Course";
import type { Program } from "@/types/Program";

export type CareerPath = {
  id: number;
  title: string;
  shortDescription: string | null;
  imageUrl: string | null;
  isFeatured: boolean;
  programCount: number;
};

export type CareerPathDetails = CareerPath & {
  overview: string | null;
  // Comma separated, e.g. "SQL, Python, Statistics"
  recommendedSkills: string | null;
  programs: Program[];
  recommendedCourses: Course[];
};
