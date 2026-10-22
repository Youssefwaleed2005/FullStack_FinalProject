import { useCallback } from "react";
import { Users } from "lucide-react";
import Chip from "@/components/manage/Chip";
import EmptyNote from "@/components/manage/EmptyNote";
import PersonCell from "@/components/manage/PersonCell";
import TableCard from "@/components/manage/TableCard";
import LoadingState from "@/components/LoadingState";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Progress } from "@/components/ui/progress";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useApiData } from "@/hooks/useApiData";
import { formatDate } from "@/lib/course";
import { getApiErrorMessage } from "@/services/api";
import { getCourseStudents } from "@/services/instructorService";

// Everyone enrolled in the course, with their progress
function StudentsTab({ courseId }: { courseId: number }) {
  const load = useCallback(() => getCourseStudents(courseId), [courseId]);
  const { data, loading, failed, error } = useApiData(load);

  if (loading) return <LoadingState label="Loading students…" />;
  if (failed || !data)
    return (
      <Alert variant="destructive">
        <AlertDescription>{getApiErrorMessage(error, "Could not load students.")}</AlertDescription>
      </Alert>
    );
  if (data.length === 0)
    return <EmptyNote icon={Users} title="No students enrolled yet" description="Students appear here once they pay for this course." />;

  return (
    <TableCard title="Students" description={`${data.length} enrolled`}>
      <Table>
        <TableHeader>
          <TableRow className="hover:bg-transparent">
            <TableHead>Student</TableHead>
            <TableHead>Enrolled</TableHead>
            <TableHead className="text-center">Attendance</TableHead>
            <TableHead className="text-center">Assignments</TableHead>
            <TableHead className="text-center">Materials</TableHead>
            <TableHead className="text-center">Average</TableHead>
            <TableHead className="min-w-44">Progress</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map((student) => (
            <TableRow key={student.userId}>
              <TableCell>
                <PersonCell name={student.fullName} detail={student.email} />
              </TableCell>
              <TableCell className="whitespace-nowrap">{formatDate(student.enrolledAt)}</TableCell>
              <TableCell className="text-center tabular-nums">
                {student.attendedSessions}/{student.pastSessions}
              </TableCell>
              <TableCell className="text-center tabular-nums">
                {student.submittedAssignments}/{student.totalAssignments}
              </TableCell>
              <TableCell className="text-center tabular-nums">
                {student.completedMaterials}/{student.totalMaterials}
              </TableCell>
              <TableCell className="text-center">
                {student.averageScore !== null ? (
                  <Chip tone={student.averageScore >= 80 ? "success" : student.averageScore >= 50 ? "warning" : "danger"}>
                    {student.averageScore}%
                  </Chip>
                ) : (
                  <span className="text-muted-foreground">–</span>
                )}
              </TableCell>
              <TableCell>
                <div className="flex items-center gap-3">
                  <Progress value={student.progressPercent} aria-label={`${student.fullName} progress`} className="h-2 flex-1 bg-secondary" />
                  <span className="w-10 text-right text-sm font-medium tabular-nums">{student.progressPercent}%</span>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableCard>
  );
}

export default StudentsTab;
