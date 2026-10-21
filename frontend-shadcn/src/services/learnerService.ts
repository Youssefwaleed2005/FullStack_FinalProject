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
} from "@/types/Learner";

export async function getLearnerDashboard(): Promise<LearnerDashboard> {
  const response = await api.get<LearnerDashboard>("/learner/dashboard");
  return response.data;
}

export async function getMyCourses(): Promise<LearnerCourse[]> {
  const response = await api.get<LearnerCourse[]>("/learner/courses");
  return response.data;
}

export async function getLearnerCourse(
  courseId: number,
): Promise<LearnerCourseDetail> {
  const response = await api.get<LearnerCourseDetail>(
    `/learner/courses/${courseId}`,
  );
  return response.data;
}

export async function getLearnerSessions(
  courseId: number,
): Promise<LearnerSession[]> {
  const response = await api.get<LearnerSession[]>(
    `/learner/courses/${courseId}/sessions`,
  );
  return response.data;
}

export async function getLearnerMaterials(
  courseId: number,
): Promise<LearnerMaterial[]> {
  const response = await api.get<LearnerMaterial[]>(
    `/learner/courses/${courseId}/materials`,
  );
  return response.data;
}

// Mark a material as done / not done → returns the new course progress
export async function setMaterialCompletion(
  materialId: number,
  completed: boolean,
): Promise<MaterialCompletionResult> {
  const response = await api.put<MaterialCompletionResult>(
    `/learner/materials/${materialId}/completion`,
    { completed },
  );
  return response.data;
}

export async function getLearnerAssignments(
  courseId: number,
): Promise<LearnerAssignment[]> {
  const response = await api.get<LearnerAssignment[]>(
    `/learner/courses/${courseId}/assignments`,
  );
  return response.data;
}

export async function submitAssignment(
  assignmentId: number,
  payload: SubmitAssignmentRequest,
): Promise<MySubmission> {
  const response = await api.put<MySubmission>(
    `/learner/assignments/${assignmentId}/submission`,
    payload,
  );
  return response.data;
}
