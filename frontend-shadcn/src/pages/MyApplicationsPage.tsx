import { Link } from "react-router-dom";
import { ArrowRight, CloudOff, FileText } from "lucide-react";
import AccountLayout from "@/components/AccountLayout";
import LoadingState from "@/components/LoadingState";
import StateMessage from "@/components/StateMessage";
import StatusPill from "@/components/StatusPill";
import { Button } from "@/components/ui/button";
import { useApiData } from "@/hooks/useApiData";
import { formatDate, formatPrice } from "@/lib/course";
import { APPLICATION_STATUS_META } from "@/lib/status";
import { panelStyle } from "@/lib/styles";
import { cn } from "@/lib/utils";
import { getApiErrorMessage } from "@/services/api";
import { getMyApplications } from "@/services/applicationService";
import type { Application } from "@/types/Application";

function MyApplicationsPage() {
  const { data, loading, failed, error } = useApiData(getMyApplications);

  return (
    <AccountLayout
      title="My applications"
      description="Courses and programs you applied to, and what is left to do."
    >
      {loading && <LoadingState label="Loading your applications…" />}

      {failed && (
        <StateMessage
          icon={CloudOff}
          title="Something went wrong"
          description={getApiErrorMessage(
            error,
            "Could not load your applications.",
          )}
        />
      )}

      {data && data.length === 0 && (
        <StateMessage
          icon={FileText}
          title="No applications yet"
          description="Find a course or program you like and press “Apply now” to get started."
          action={
            <Button asChild size="lg" className="rounded-full px-5">
              <Link to="/courses">Browse courses</Link>
            </Button>
          }
        />
      )}

      {data && data.length > 0 && (
        <ul className="flex flex-col gap-4">
          {data.map((application) => (
            <li key={application.id}>
              <ApplicationItem application={application} />
            </li>
          ))}
        </ul>
      )}
    </AccountLayout>
  );
}

type ApplicationItemProps = {
  application: Application;
};

function ApplicationItem({ application }: ApplicationItemProps) {
  const targetLink =
    application.targetType === "Course"
      ? `/courses/${application.courseId}`
      : `/programs/${application.programId}`;

  return (
    <article className={cn(panelStyle, "p-5 sm:p-6")}>
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="min-w-0">
          <p className="text-xs font-semibold tracking-[0.14em] text-sand-deep uppercase">
            {application.targetType}
          </p>
          <h2 className="mt-1.5 text-xl leading-snug font-semibold">
            <Link
              to={targetLink}
              className="rounded-sm outline-none hover:underline focus-visible:ring-3 focus-visible:ring-ring/50"
            >
              {application.targetTitle}
            </Link>
          </h2>
        </div>
        <p className="text-lg font-semibold">
          {formatPrice(application.price)}
        </p>
      </div>

      <div className="mt-5 flex flex-wrap items-center justify-between gap-3 border-t pt-4">
        <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
          <StatusPill status={APPLICATION_STATUS_META[application.status]} />
          Applied {formatDate(application.createdAt)}
        </div>

        {/* Applied but not paid yet */}
        {application.status === "Submitted" && (
          <Button asChild className="rounded-full px-4">
            <Link to={`/payment/${application.id}`}>
              Pay now
              <ArrowRight data-icon="inline-end" />
            </Link>
          </Button>
        )}

        {application.status === "Accepted" && (
          <Button asChild variant="outline" className="rounded-full px-4">
            <Link to="/my-enrollments">View my enrollment</Link>
          </Button>
        )}
      </div>
    </article>
  );
}

export default MyApplicationsPage;
