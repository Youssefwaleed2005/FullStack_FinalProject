import type { CareerPath } from "./CareerPath";
import type { Program } from "./Program";
import type { Course } from "./Course";

export type CareerPathDetails = CareerPath & {
  overview: string | null;
  recommendedSkills: string | null;
  programs: Program[];
  recommendedCourses: Course[];
};
