import api from "./api";
import type {
  LearnerAssignment,
  LearnerCourse,
  LearnerCourseDetail,
  LearnerDashboard,
  LearnerMaterial,
  LearnerSession,
  MaterialCompletionResult,
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
): Promise<LearnerMaterial[]> {
  return (
    await api.get<LearnerMaterial[]>(`/learner/courses/${courseId}/materials`)
  ).data;
}

// Mark a material as done / not done → returns the new course progress
export async function setMaterialCompletion(
  materialId: number,
  completed: boolean,
): Promise<MaterialCompletionResult> {
  return (
    await api.put<MaterialCompletionResult>(
      `/learner/materials/${materialId}/completion`,
      { completed },
    )
  ).data;
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
