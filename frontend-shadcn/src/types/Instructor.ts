import type { Course } from "./Course";
import type { AttendanceStatus } from "./Lms";

export type UpcomingSession = {
  id: number;
  courseId: number;
  courseTitle: string;
  title: string;
  startTime: string;
  endTime: string;
  location: string | null;
};

export type InstructorDashboard = {
  courseCount: number;
  studentCount: number;
  upcomingSessionCount: number;
  pendingSubmissions: number;
  upcomingSessions: UpcomingSession[];
};

export type InstructorCourse = {
  id: number;
  title: string;
  imageUrl: string | null;
  status: Course["status"];
  startDate: string | null;
  endDate: string | null;
  location: string | null;
  schedule: string | null;
  capacity: number;
  studentCount: number;
  sessionCount: number;
  upcomingSessionCount: number;
  nextSessionAt: string | null;
  assignmentCount: number;
  pendingSubmissions: number;
};

export type CourseStudent = {
  userId: number;
  fullName: string;
  email: string;
  enrolledAt: string;
  attendedSessions: number;
  pastSessions: number;
  submittedAssignments: number;
  totalAssignments: number;
  completedMaterials: number;
  totalMaterials: number;
  averageScore: number | null;
  progressPercent: number;
};

export type StudentAttendance = {
  userId: number;
  fullName: string;
  email: string;
  status: AttendanceStatus | null; // null = not marked yet
  markedAt: string | null;
};

export type SessionAttendance = {
  sessionId: number;
  courseId: number;
  sessionTitle: string;
  startTime: string;
  students: StudentAttendance[];
};

export type MarkAttendanceRequest = {
  records: { userId: number; status: AttendanceStatus }[];
};

export type GradeSubmissionRequest = {
  score: number;
  feedback?: string;
};
