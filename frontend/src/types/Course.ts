export type Course = {
  id: number;
  title: string;
  shortDescription: string | null;
  imageUrl: string | null;
  durationHours: number;
  price: number;
  location: string | null;
  startDate: string | null;
  type: "Offline" | "Online";
  status:
    | "Draft"
    | "ComingSoon"
    | "OpenForEnrollment"
    | "Full"
    | "InProgress"
    | "Completed";
  isFeatured: boolean;
  categoryId: number;
  categoryName: string;
  instructorId: number | null;
  instructorName: string | null;
};
