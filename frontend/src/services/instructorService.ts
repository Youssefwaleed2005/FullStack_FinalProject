import api from "./api";
import type {
  CourseStudent,
  GradeSubmissionRequest,
  InstructorCourse,
  InstructorDashboard,
  MarkAttendanceRequest,
  SessionAttendance,
} from "../types/Instructor";
import type {
  Assignment,
  AssignmentRequest,
  Material,
  MaterialRequest,
  Session,
  SessionRequest,
  Submission,
} from "../types/Lms";

// ---------- Dashboard & courses ----------
export async function getInstructorDashboard(): Promise<InstructorDashboard> {
  return (await api.get<InstructorDashboard>("/instructor/dashboard")).data;
}

export async function getMyTeachingCourses(): Promise<InstructorCourse[]> {
  return (await api.get<InstructorCourse[]>("/instructor/courses")).data;
}

export async function getCourseStudents(
  courseId: number,
): Promise<CourseStudent[]> {
  return (
    await api.get<CourseStudent[]>(`/instructor/courses/${courseId}/students`)
  ).data;
}

// ---------- Sessions ----------
export async function getCourseSessions(courseId: number): Promise<Session[]> {
  return (await api.get<Session[]>(`/instructor/courses/${courseId}/sessions`))
    .data;
}

export async function createSession(
  courseId: number,
  payload: SessionRequest,
): Promise<Session> {
  return (
    await api.post<Session>(`/instructor/courses/${courseId}/sessions`, payload)
  ).data;
}

export async function updateSession(
  id: number,
  payload: SessionRequest,
): Promise<Session> {
  return (await api.put<Session>(`/instructor/sessions/${id}`, payload)).data;
}

export async function deleteSession(id: number): Promise<void> {
  await api.delete(`/instructor/sessions/${id}`);
}

// ---------- Attendance ----------
export async function getSessionAttendance(
  sessionId: number,
): Promise<SessionAttendance> {
  return (
    await api.get<SessionAttendance>(
      `/instructor/sessions/${sessionId}/attendance`,
    )
  ).data;
}

export async function markAttendance(
  sessionId: number,
  payload: MarkAttendanceRequest,
): Promise<SessionAttendance> {
  return (
    await api.put<SessionAttendance>(
      `/instructor/sessions/${sessionId}/attendance`,
      payload,
    )
  ).data;
}

// ---------- Materials ----------
export async function getCourseMaterials(
  courseId: number,
): Promise<Material[]> {
  return (
    await api.get<Material[]>(`/instructor/courses/${courseId}/materials`)
  ).data;
}

export async function createMaterial(
  courseId: number,
  payload: MaterialRequest,
): Promise<Material> {
  return (
    await api.post<Material>(
      `/instructor/courses/${courseId}/materials`,
      payload,
    )
  ).data;
}

export async function updateMaterial(
  id: number,
  payload: MaterialRequest,
): Promise<Material> {
  return (await api.put<Material>(`/instructor/materials/${id}`, payload)).data;
}

export async function deleteMaterial(id: number): Promise<void> {
  await api.delete(`/instructor/materials/${id}`);
}

// ---------- Assignments & grading ----------
export async function getCourseAssignments(
  courseId: number,
): Promise<Assignment[]> {
  return (
    await api.get<Assignment[]>(`/instructor/courses/${courseId}/assignments`)
  ).data;
}

export async function createAssignment(
  courseId: number,
  payload: AssignmentRequest,
): Promise<Assignment> {
  return (
    await api.post<Assignment>(
      `/instructor/courses/${courseId}/assignments`,
      payload,
    )
  ).data;
}

export async function updateAssignment(
  id: number,
  payload: AssignmentRequest,
): Promise<Assignment> {
  return (await api.put<Assignment>(`/instructor/assignments/${id}`, payload))
    .data;
}

export async function deleteAssignment(id: number): Promise<void> {
  await api.delete(`/instructor/assignments/${id}`);
}

export async function getAssignmentSubmissions(
  assignmentId: number,
): Promise<Submission[]> {
  return (
    await api.get<Submission[]>(
      `/instructor/assignments/${assignmentId}/submissions`,
    )
  ).data;
}

export async function gradeSubmission(
  submissionId: number,
  payload: GradeSubmissionRequest,
): Promise<Submission> {
  return (
    await api.put<Submission>(
      `/instructor/submissions/${submissionId}/grade`,
      payload,
    )
  ).data;
}
