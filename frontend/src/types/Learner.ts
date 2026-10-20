import type { Course } from "./Course";
import type { EnrollmentStatus } from "./Enrollment";
import type { UpcomingSession } from "./Instructor";
import type { AttendanceStatus, SubmissionStatus } from "./Lms";

export type LearnerCourse = {
  id: number;
  title: string;
  imageUrl: string | null;
  status: Course["status"];
  startDate: string | null;
  endDate: string | null;
  schedule: string | null;
  location: string | null;
  instructorName: string | null;
  programTitle: string | null;
  enrollmentStatus: EnrollmentStatus;
  progressPercent: number;
  nextSessionAt: string | null;
  pendingAssignments: number;
};

export type LearnerInstructor = {
  id: number;
  fullName: string;
  email: string;
  specialization: string | null;
  bio: string | null;
  photoUrl: string | null;
};

export type LearnerProgress = {
  attendedSessions: number;
  pastSessions: number;
  submittedAssignments: number;
  totalAssignments: number;
  averageScore: number | null;
  progressPercent: number;
};

export type LearnerCourseDetail = {
  id: number;
  title: string;
  shortDescription: string | null;
  fullDescription: string | null;
  objectives: string | null;
  imageUrl: string | null;
  categoryName: string;
  status: Course["status"];
  durationHours: number;
  startDate: string | null;
  endDate: string | null;
  schedule: string | null;
  location: string | null;
  instructor: LearnerInstructor | null;
  programTitle: string | null;
  enrollmentStatus: EnrollmentStatus;
  canSubmit: boolean;
  progress: LearnerProgress;
};

export type LearnerSession = {
  id: number;
  courseId: number;
  title: string;
  description: string | null;
  startTime: string;
  endTime: string;
  location: string | null;
  isPast: boolean;
  myAttendance: AttendanceStatus | null;
};

export type MySubmission = {
  id: number;
  content: string | null;
  fileUrl: string | null;
  submittedAt: string;
  isLate: boolean;
  status: SubmissionStatus;
  score: number | null;
  feedback: string | null;
  gradedAt: string | null;
};

export type LearnerAssignment = {
  id: number;
  courseId: number;
  title: string;
  description: string | null;
  dueDate: string;
  maxScore: number;
  isPastDue: boolean;
  mySubmission: MySubmission | null;
};

export type SubmitAssignmentRequest = {
  content?: string;
  fileUrl?: string; // send undefined, never "" (backend [Url] rejects empty strings)
};

export type LearnerDashboard = {
  activeCourseCount: number;
  upcomingSessionCount: number;
  pendingAssignmentCount: number;
  averageProgress: number;
  upcomingSessions: UpcomingSession[];
  courses: LearnerCourse[];
};
