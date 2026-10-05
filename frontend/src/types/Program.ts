import type { Course } from "./Course";

export type Program = {
  id: number;
  title: string;
  shortDescription: string | null;
  imageUrl: string | null;
  durationWeeks: number;
  price: number;
  location: string | null;
  startDate: string | null;
  status: Course["status"];
  isFeatured: boolean;
  categoryId: number;
  categoryName: string;
  courseCount: number;
};
