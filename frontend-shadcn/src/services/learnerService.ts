import api from "./api";
import type { LearnerNotification } from "@/types/Notification";
import type { LearnerActivity } from "@/types/Activity";
import type { CourseReview, CourseReviewRequest } from "@/types/Review";
import type {
  CalendarEvent,
  LearnerAssignment,
  LearnerCalendar,
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

// Every session and assignment deadline across my courses, for the calendar page.
// There is no single endpoint for this, so it asks each course; a course that fails is skipped.
export async function getLearnerCalendar(): Promise<LearnerCalendar> {
  // Cancelled enrollments can't open the course (the API answers 403)
  const courses = (await getMyCourses()).filter(
    (course) => course.enrollmentStatus !== "Cancelled",
  );

  const perCourse = await Promise.allSettled(
    courses.map(async (course): Promise<CalendarEvent[]> => {
      const [sessions, assignments] = await Promise.all([
        getLearnerSessions(course.id),
        getLearnerAssignments(course.id),
      ]);
      const base = { courseId: course.id, courseTitle: course.title };
      return [
        ...sessions.map((session) => ({ ...base, kind: "session" as const, key: `session-${session.id}`, session })),
        ...assignments.map((assignment) => ({
          ...base,
          kind: "deadline" as const,
          key: `deadline-${assignment.id}`,
          assignment,
        })),
      ];
    }),
  );

  return {
    courseCount: courses.length,
    events: perCourse.flatMap((result) =>
      result.status === "fulfilled" ? result.value : [],
    ),
  };
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

// Bell in the navbar: graded work, new materials/assignments, deadlines and sessions coming up
export async function getNotifications(): Promise<LearnerNotification[]> {
  return (await api.get<LearnerNotification[]>("/learner/notifications")).data;
}

// Learning activity per day + streaks (dashboard heatmap)
export async function getActivity(): Promise<LearnerActivity> {
  return (await api.get<LearnerActivity>("/learner/activity")).data;
}

// My review of a course (null when I haven't written one)
export async function getMyReview(courseId: number): Promise<CourseReview | null> {
  const response = await api.get<CourseReview | "">(`/learner/courses/${courseId}/review`);
  return response.status === 204 || !response.data ? null : (response.data as CourseReview);
}

export async function saveMyReview(courseId: number, payload: CourseReviewRequest): Promise<CourseReview> {
  return (await api.put<CourseReview>(`/learner/courses/${courseId}/review`, payload)).data;
}

export async function deleteMyReview(courseId: number): Promise<void> {
  await api.delete(`/learner/courses/${courseId}/review`);
}
