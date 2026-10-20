import api from "./api";
import type { Material } from "../types/Lms";
import type {
  LearnerAssignment,
  LearnerCourse,
  LearnerCourseDetail,
  LearnerDashboard,
  LearnerSession,
  MySubmission,
  SubmitAssignmentRequest,
} from "../types/Learner";

export async function getLearnerDashboard(): Promise<LearnerDashboard> {
  return (await api.get<LearnerDashboard>("/learner/dashboard")).data;
}

export async function getMyCourses(): Promise<LearnerCourse[]> {
  return (await api.get<LearnerCourse[]>("/learner/courses")).data;
}

export async function getLearnerCourse(
  courseId: number,
): Promise<LearnerCourseDetail> {
  return (await api.get<LearnerCourseDetail>(`/learner/courses/${courseId}`))
    .data;
}

export async function getLearnerSessions(
  courseId: number,
): Promise<LearnerSession[]> {
  return (
    await api.get<LearnerSession[]>(`/learner/courses/${courseId}/sessions`)
  ).data;
}

export async function getLearnerMaterials(
  courseId: number,
): Promise<Material[]> {
  return (await api.get<Material[]>(`/learner/courses/${courseId}/materials`))
    .data;
}

export async function getLearnerAssignments(
  courseId: number,
): Promise<LearnerAssignment[]> {
  return (
    await api.get<LearnerAssignment[]>(
      `/learner/courses/${courseId}/assignments`,
    )
  ).data;
}

export async function submitAssignment(
  assignmentId: number,
  payload: SubmitAssignmentRequest,
): Promise<MySubmission> {
  return (
    await api.put<MySubmission>(
      `/learner/assignments/${assignmentId}/submission`,
      payload,
    )
  ).data;
}
