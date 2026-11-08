export type LearnerNotificationType =
  | "Graded"
  | "NewMaterial"
  | "NewAssignment"
  | "DueSoon"
  | "SessionSoon";

export type LearnerNotification = {
  id: string;
  type: LearnerNotificationType;
  title: string;
  message: string;
  courseId: number;
  courseTitle: string;
  time: string;
};
