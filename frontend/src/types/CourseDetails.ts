import type { Course } from "./Course";

export type CourseDetails = Course & {
  fullDescription: string | null;
  objectives: string | null;
  schedule: string | null;
  endDate: string | null;
  capacity: number;
  instructorBio: string | null;
  instructorPhotoUrl: string | null;
};
