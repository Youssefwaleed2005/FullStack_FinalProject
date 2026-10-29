export type Testimonial = {
  id: number;
  authorName: string;
  authorTitle: string | null;
  photoUrl: string | null;
  content: string;
};

// Admin list: unpublished testimonials included
export type TestimonialAdmin = {
  id: number;
  authorName: string;
  authorTitle: string | null;
  photoUrl: string | null;
  content: string;
  rating: number | null;
  isPublished: boolean;
  createdAt: string;
};

export type TestimonialRequest = {
  authorName: string;
  authorTitle: string | null;
  photoUrl: string | null;
  content: string;
  rating: number | null;
  isPublished: boolean;
};
