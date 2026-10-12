import type { CourseStatus } from "@/types/Course";

export type Program = {
  id: number;
  title: string;
  shortDescription: string | null;
  imageUrl: string | null;
  durationWeeks: number;
  price: number;
  location: string | null;
  startDate: string | null;
  status: CourseStatus;
  isFeatured: boolean;
  categoryId: number;
  categoryName: string;
  courseCount: number;
};

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
