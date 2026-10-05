import type { Program } from "./Program";

export type ProgramCourse = {
  courseId: number;
  title: string;
  imageUrl: string | null;
  durationHours: number;
  sortOrder: number;
};

export type ProgramDetails = Program & {
  overview: string | null;
  requirements: string | null;
  paymentInfo: string | null;
  schedule: string | null;
  endDate: string | null;
  capacity: number;
  courses: ProgramCourse[];
};
