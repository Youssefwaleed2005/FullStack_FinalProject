import type { Course } from "./Course";
import type { PaymentMethod, PaymentStatus } from "./Payment";

export type AdminPayment = {
  id: number;
  amount: number;
  currency: string;
  method: PaymentMethod;
  status: PaymentStatus;
  transactionId: string | null;
  createdAt: string;
  paidAt: string | null;
  userId: number;
  studentName: string;
  studentEmail: string;
  targetType: "Course" | "Program";
  targetTitle: string;
};

export type AdminDashboard = {
  learnerCount: number;
  instructorCount: number;
  courseCount: number;
  openCourseCount: number;
  programCount: number;
  activeEnrollmentCount: number;
  pendingApplicationCount: number;
  totalRevenue: number;
  revenueThisMonth: number;
  recentPayments: AdminPayment[];
};

export type AdminUser = {
  id: number;
  firstName: string;
  lastName: string;
  fullName: string;
  email: string;
  phoneNumber: string | null;
  country: string | null;
  specialization: string | null;
  roles: string[];
  isActive: boolean;
  createdAt: string;
  activeEnrollments: number;
  coursesTaught: number;
};

export type CreateInstructorRequest = {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  phoneNumber?: string;
  specialization?: string;
  bio?: string;
};

// Body for POST /api/courses and PUT /api/courses/{id} (admin only)
export type CourseRequest = {
  title: string;
  shortDescription?: string;
  fullDescription?: string;
  objectives?: string;
  imageUrl?: string;
  durationHours: number;
  price: number;
  location?: string;
  schedule?: string;
  startDate?: string; // "2026-11-01"
  endDate?: string;
  capacity: number;
  type: Course["type"];
  status: Course["status"];
  isFeatured: boolean;
  categoryId: number;
  instructorId?: number;
};
