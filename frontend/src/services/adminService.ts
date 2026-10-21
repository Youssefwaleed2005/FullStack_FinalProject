import api from "./api";
import type {
  AdminDashboard,
  AdminPayment,
  AdminUser,
  CourseRequest,
  CreateInstructorRequest,
} from "../types/Admin";
import type { Course } from "../types/Course";
import type { CourseDetails } from "../types/CourseDetails";
import type { PaymentStatus } from "../types/Payment";

export async function getAdminDashboard(): Promise<AdminDashboard> {
  return (await api.get<AdminDashboard>("/admin/dashboard")).data;
}

export async function getAdminPayments(params?: {
  status?: PaymentStatus;
  search?: string;
}): Promise<AdminPayment[]> {
  return (await api.get<AdminPayment[]>("/admin/payments", { params })).data;
}

export async function getAdminUsers(params?: {
  role?: string;
  search?: string;
  isActive?: boolean;
}): Promise<AdminUser[]> {
  return (await api.get<AdminUser[]>("/admin/users", { params })).data;
}

export async function setUserStatus(
  id: number,
  isActive: boolean,
): Promise<AdminUser> {
  return (await api.put<AdminUser>(`/admin/users/${id}/status`, { isActive }))
    .data;
}

export async function createInstructor(
  payload: CreateInstructorRequest,
): Promise<AdminUser> {
  return (await api.post<AdminUser>("/admin/instructors", payload)).data;
}

export async function assignInstructor(
  courseId: number,
  instructorId: number,
): Promise<void> {
  await api.put(`/admin/courses/${courseId}/instructor`, { instructorId });
}

// All courses, drafts included
export async function getAdminCourses(): Promise<Course[]> {
  return (await api.get<Course[]>("/admin/courses")).data;
}

export async function createCourse(payload: CourseRequest): Promise<CourseDetails> {
  return (await api.post<CourseDetails>("/courses", payload)).data;
}

export async function updateCourse(id: number, payload: CourseRequest): Promise<CourseDetails> {
  return (await api.put<CourseDetails>(`/courses/${id}`, payload)).data;
}
