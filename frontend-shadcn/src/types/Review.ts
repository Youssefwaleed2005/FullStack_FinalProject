export type CourseReview = {
  id: number;
  rating: number;
  comment: string | null;
  authorName: string;
  authorPhotoUrl: string | null;
  createdAt: string;
  updatedAt: string | null;
};

export type CourseReviews = {
  averageRating: number | null;
  reviewCount: number;
  // index 0 = 5 stars … index 4 = 1 star
  starCounts: number[];
  reviews: CourseReview[];
};

export type CourseReviewRequest = {
  rating: number;
  comment?: string;
};
