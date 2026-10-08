export type CourseType = "Offline" | "Online";

export type CourseStatus =
  | "Draft"
  | "ComingSoon"
  | "OpenForEnrollment"
  | "Full"
  | "InProgress"
  | "Completed";

export type Course = {
  id: number;
  title: string;
  shortDescription: string | null;
  imageUrl: string | null;
  durationHours: number;
  price: number;
  location: string | null;
  startDate: string | null;
  type: CourseType;
  status: CourseStatus;
  isFeatured: boolean;
  categoryId: number;
  categoryName: string;
  instructorId: number | null;
  instructorName: string | null;
};
