import { Link } from "react-router-dom";
import {
  ArrowRight,
  Banknote,
  BookOpen,
  FileText,
  GraduationCap,
  Layers,
  Presentation,
  ShieldCheck,
  TrendingUp,
  UserCheck,
} from "lucide-react";
import { ADMIN_LINKS } from "@/components/admin/adminLinks";
import PaymentsTable from "@/components/admin/PaymentsTable";
import LoadingState from "@/components/LoadingState";
import EmptyNote from "@/components/manage/EmptyNote";
import ManageHeader from "@/components/manage/ManageHeader";
import StatTile from "@/components/manage/StatTile";
import TableCard from "@/components/manage/TableCard";
import StateMessage from "@/components/StateMessage";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { useApiData } from "@/hooks/useApiData";
import { pageContainer, panelStyle } from "@/lib/styles";
import { cn } from "@/lib/utils";
import { getApiErrorMessage } from "@/services/api";
import { getAdminDashboard } from "@/services/adminService";

const QUICK_ACTIONS = [
  { label: "Add an instructor", description: "Create an account for a new teacher", to: "/admin/users", icon: Presentation },
  { label: "Create a course", description: "Add a course or edit an existing one", to: "/admin/courses", icon: BookOpen },
  { label: "Review payments", description: "Search and filter every payment", to: "/admin/payments", icon: Banknote },
];

// Admin home: the whole academy in numbers, plus the latest payments
function AdminDashboardPage() {
  const { data, loading, failed, error, reload } = useApiData(getAdminDashboard);

  if (loading) return <LoadingState label="Loading the dashboard…" />;
  if (failed || !data)
    return (
      <div className="flex flex-1 items-center justify-center">
        <StateMessage
          icon={ShieldCheck}
          title="Could not load the dashboard"
          description={getApiErrorMessage(error, "Please try again in a moment.")}
          action={<Button className="rounded-full px-5" onClick={reload}>Try again</Button>}
        />
      </div>
    );

  const openShare = data.courseCount ? Math.round((data.openCourseCount / data.courseCount) * 100) : 0;
  const monthShare = data.totalRevenue ? Math.round((data.revenueThisMonth / data.totalRevenue) * 100) : 0;

  return (
    <>
      <ManageHeader
        eyebrow="Admin"
        title="Academy overview"
        description="People, courses and money at a glance."
        links={ADMIN_LINKS}
      />

      <div className={cn(pageContainer, "flex flex-col gap-8 py-10")}>
        {/* Revenue highlight + people */}
        <div className="grid gap-4 lg:grid-cols-3">
          <section className="relative overflow-hidden rounded-2xl bg-linear-to-br from-primary to-primary/85 p-6 text-primary-foreground shadow-xl shadow-primary/15 lg:row-span-2">
            <div aria-hidden className="bg-andalusia-pattern pointer-events-none absolute inset-0 opacity-15" />
            <div aria-hidden className="pointer-events-none absolute -right-10 -bottom-16 size-56 rounded-full bg-sand/30 blur-3xl" />
            <div className="relative">
              <p className="flex items-center gap-2 text-sm text-primary-foreground/70">
                <TrendingUp aria-hidden className="size-4 text-sand" /> Total revenue
              </p>
              <p className="mt-2 font-heading text-4xl font-semibold sm:text-5xl">
                EGP {data.totalRevenue.toLocaleString()}
              </p>
              <div className="mt-8 rounded-xl bg-primary-foreground/10 p-4">
                <p className="text-sm text-primary-foreground/70">This month</p>
                <p className="mt-1 text-2xl font-semibold">EGP {data.revenueThisMonth.toLocaleString()}</p>
                <Progress value={monthShare} aria-label="Share of revenue this month" className="mt-3 h-1.5 bg-primary-foreground/15 [&>*]:bg-sand" />
                <p className="mt-2 text-xs text-primary-foreground/60">{monthShare}% of all revenue so far</p>
              </div>
            </div>
          </section>

          <StatTile label="Learners" value={data.learnerCount} icon={GraduationCap} />
          <StatTile label="Instructors" value={data.instructorCount} icon={Presentation} />
          <StatTile label="Active enrollments" value={data.activeEnrollmentCount} icon={UserCheck} />
          <StatTile label="Pending applications" value={data.pendingApplicationCount} icon={FileText} hint="Applied but not paid yet" tone="warning" />
        </div>

        {/* Catalog + quick actions */}
        <div className="grid gap-4 lg:grid-cols-3">
          <section className={cn(panelStyle, "p-6")}>
            <h2 className="text-lg font-semibold">Catalog</h2>
            <div className="mt-4 grid grid-cols-2 gap-4">
              <div>
                <p className="flex items-center gap-1.5 text-sm text-muted-foreground">
                  <BookOpen aria-hidden className="size-4" /> Courses
                </p>
                <p className="mt-1 font-heading text-3xl font-semibold">{data.courseCount}</p>
              </div>
              <div>
                <p className="flex items-center gap-1.5 text-sm text-muted-foreground">
                  <Layers aria-hidden className="size-4" /> Programs
                </p>
                <p className="mt-1 font-heading text-3xl font-semibold">{data.programCount}</p>
              </div>
            </div>
            <div className="mt-5">
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>Open for enrollment</span>
                <span>
                  {data.openCourseCount}/{data.courseCount}
                </span>
              </div>
              <Progress value={openShare} aria-label="Courses open for enrollment" className="mt-1.5 h-1.5 bg-secondary" />
            </div>
          </section>

          <section className="grid gap-3 sm:grid-cols-3 lg:col-span-2">
            {QUICK_ACTIONS.map((action) => (
              <Link
                key={action.label}
                to={action.to}
                className={cn(
                  panelStyle,
                  "group flex flex-col p-5 transition duration-300 outline-none hover:-translate-y-1 hover:border-sand/70 hover:shadow-xl hover:shadow-primary/10 focus-visible:ring-3 focus-visible:ring-ring/50 motion-reduce:hover:translate-y-0",
                )}
              >
                <span className="flex size-11 items-center justify-center rounded-2xl bg-primary text-primary-foreground transition-transform duration-300 group-hover:-rotate-6">
                  <action.icon aria-hidden className="size-5" />
                </span>
                <span className="mt-4 font-semibold">{action.label}</span>
                <span className="mt-1 text-sm text-muted-foreground">{action.description}</span>
                <span className="mt-auto flex items-center gap-1 pt-4 text-sm font-medium text-sand-deep">
                  Go <ArrowRight aria-hidden className="size-4 transition group-hover:translate-x-1" />
                </span>
              </Link>
            ))}
          </section>
        </div>

        {/* Recent payments */}
        <TableCard
          title="Recent payments"
          action={
            <Button asChild variant="outline" className="rounded-full px-4">
              <Link to="/admin/payments">
                View all <ArrowRight data-icon="inline-end" />
              </Link>
            </Button>
          }
        >
          {data.recentPayments.length === 0 ? (
            <div className="p-5">
              <EmptyNote icon={Banknote} title="No payments yet" />
            </div>
          ) : (
            <PaymentsTable payments={data.recentPayments} />
          )}
        </TableCard>
      </div>
    </>
  );
}

export default AdminDashboardPage;
