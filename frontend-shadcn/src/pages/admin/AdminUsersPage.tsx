import { useCallback, useState } from "react";
import { CircleCheck, GraduationCap, Presentation, UserPlus, Users } from "lucide-react";
import { ADMIN_LINKS } from "@/components/admin/adminLinks";
import CreateInstructorDialog from "@/components/admin/CreateInstructorDialog";
import LoadingState from "@/components/LoadingState";
import Chip from "@/components/manage/Chip";
import ConfirmDialog, { type ConfirmRequest } from "@/components/manage/ConfirmDialog";
import EmptyNote from "@/components/manage/EmptyNote";
import ManageHeader from "@/components/manage/ManageHeader";
import PersonCell from "@/components/manage/PersonCell";
import TableCard from "@/components/manage/TableCard";
import SearchInput from "@/components/SearchInput";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useApiData } from "@/hooks/useApiData";
import { formatDate } from "@/lib/course";
import { pageContainer } from "@/lib/styles";
import { cn } from "@/lib/utils";
import { getApiErrorMessage } from "@/services/api";
import { getAdminUsers, setUserStatus } from "@/services/adminService";
import type { AdminUser } from "@/types/Admin";

type Role = "Learner" | "Instructor";

// Learners and instructors: search, activate / deactivate, add instructors
function AdminUsersPage() {
  const [role, setRole] = useState<Role>("Learner");
  const [search, setSearch] = useState("");
  const [createOpen, setCreateOpen] = useState(false);
  const [createKey, setCreateKey] = useState(0);
  const [confirm, setConfirm] = useState<ConfirmRequest | null>(null);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const load = useCallback(() => getAdminUsers({ role, search: search || undefined }), [role, search]);
  const { data: users, loading, failed, error: loadError, reload } = useApiData(load);

  function askToggle(user: AdminUser) {
    const activate = !user.isActive;
    setConfirm({
      title: activate ? `Activate ${user.fullName}?` : `Deactivate ${user.fullName}?`,
      description: activate
        ? "They will be able to sign in again."
        : "They won't be able to sign in until you activate them again. Nothing is deleted.",
      confirmLabel: activate ? "Activate" : "Deactivate",
      danger: !activate,
      onConfirm: async () => {
        try {
          await setUserStatus(user.id, activate);
          setError("");
          setMessage(`${user.fullName} is now ${activate ? "active" : "deactivated"}.`);
          reload();
        } catch (err) {
          setError(getApiErrorMessage(err, "Could not change this user's status."));
        }
      },
    });
  }

  return (
    <>
      <ManageHeader
        eyebrow="Admin"
        title="Manage users"
        description="Find learners and instructors, and control who can sign in."
        links={ADMIN_LINKS}
        actions={
          <Button
            className="h-10 rounded-full bg-sand px-5 text-primary hover:bg-sand/85"
            onClick={() => {
              setCreateKey((key) => key + 1);
              setCreateOpen(true);
            }}
          >
            <UserPlus aria-hidden /> Add instructor
          </Button>
        }
      />

      <div className={cn(pageContainer, "flex flex-col gap-5 py-10")}>
        <div className="flex flex-wrap items-center justify-between gap-3">
          <Tabs value={role} onValueChange={(value) => setRole(value as Role)}>
            <TabsList className="h-10! rounded-full bg-secondary p-1">
              <TabsTrigger value="Learner" className="gap-2 rounded-full px-4">
                <GraduationCap aria-hidden /> Learners
              </TabsTrigger>
              <TabsTrigger value="Instructor" className="gap-2 rounded-full px-4">
                <Presentation aria-hidden /> Instructors
              </TabsTrigger>
            </TabsList>
          </Tabs>
          <SearchInput value={search} onSearch={setSearch} placeholder="Search name or email" className="w-full sm:w-80" />
        </div>

        {error && (
          <Alert variant="destructive">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
        {message && (
          <Alert className="border-emerald-200 bg-emerald-50 text-emerald-800">
            <CircleCheck />
            <AlertDescription className="text-emerald-800">{message}</AlertDescription>
          </Alert>
        )}

        {loading && !users ? (
          <LoadingState label="Loading users…" />
        ) : failed || !users ? (
          <Alert variant="destructive">
            <AlertDescription>{getApiErrorMessage(loadError, "Could not load users.")}</AlertDescription>
          </Alert>
        ) : users.length === 0 ? (
          <EmptyNote icon={Users} title="No users found" description={search ? "Try a different name or email." : undefined} />
        ) : (
          <TableCard title={role === "Learner" ? "Learners" : "Instructors"} description={`${users.length} found`}>
            <Table>
              <TableHeader>
                <TableRow className="hover:bg-transparent">
                  <TableHead>Name</TableHead>
                  <TableHead>Phone / country</TableHead>
                  <TableHead>Joined</TableHead>
                  <TableHead className="text-center">{role === "Learner" ? "Active enrollments" : "Courses taught"}</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {users.map((user) => (
                  <TableRow key={user.id} className={cn(!user.isActive && "opacity-60")}>
                    <TableCell>
                      <PersonCell name={user.fullName} detail={[user.email, user.specialization].filter(Boolean).join(" · ")} />
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {[user.phoneNumber, user.country].filter(Boolean).join(" · ") || "–"}
                    </TableCell>
                    <TableCell className="whitespace-nowrap">{formatDate(user.createdAt)}</TableCell>
                    <TableCell className="text-center font-medium tabular-nums">
                      {role === "Learner" ? user.activeEnrollments : user.coursesTaught}
                    </TableCell>
                    <TableCell>
                      <Chip tone={user.isActive ? "success" : "neutral"}>{user.isActive ? "Active" : "Deactivated"}</Chip>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant={user.isActive ? "destructive" : "outline"}
                        size="sm"
                        className="rounded-full px-3"
                        onClick={() => askToggle(user)}
                      >
                        {user.isActive ? "Deactivate" : "Activate"}
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableCard>
        )}
      </div>

      <CreateInstructorDialog
        key={createKey}
        open={createOpen}
        onClose={() => setCreateOpen(false)}
        onCreated={(name) => {
          setCreateOpen(false);
          setMessage(`${name} was added as an instructor.`);
          setRole("Instructor");
          reload();
        }}
      />

      <ConfirmDialog request={confirm} onClose={() => setConfirm(null)} />
    </>
  );
}

export default AdminUsersPage;
