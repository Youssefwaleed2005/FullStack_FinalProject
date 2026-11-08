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
  // Reviews (averageRating is null when there are none yet)
  averageRating?: number | null;
  reviewCount?: number;
  // Admin list only
  isDeleted?: boolean;
  updatedAt?: string | null;
  updatedBy?: string | null;
};

export type CourseDetails = Course & {
  fullDescription: string | null;
  objectives: string | null;
  schedule: string | null;
  endDate: string | null;
  capacity: number;
  instructorBio: string | null;
  instructorPhotoUrl: string | null;
};
