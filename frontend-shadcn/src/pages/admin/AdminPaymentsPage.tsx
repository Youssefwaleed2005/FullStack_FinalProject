import { useCallback, useState } from "react";
import { Banknote, CircleCheck, Hourglass, Wallet } from "lucide-react";
import { ADMIN_LINKS } from "@/components/admin/adminLinks";
import PaymentsTable from "@/components/admin/PaymentsTable";
import PageSkeleton from "@/components/PageSkeleton";
import EmptyNote from "@/components/manage/EmptyNote";
import ManageHeader from "@/components/manage/ManageHeader";
import StatTile from "@/components/manage/StatTile";
import TableCard from "@/components/manage/TableCard";
import SearchInput from "@/components/SearchInput";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useApiData } from "@/hooks/useApiData";
import { pageContainer } from "@/lib/styles";
import { cn } from "@/lib/utils";
import { getApiErrorMessage } from "@/services/api";
import { getAdminPaymentsPage } from "@/services/adminService";
import CoursePagination from "@/components/CoursePagination";
import type { PaymentStatus } from "@/types/Payment";

const FILTERS: (PaymentStatus | "All")[] = ["All", "Paid", "Pending", "Failed", "Refunded"];

// Every payment, filterable by status and searchable by student or transaction
function AdminPaymentsPage() {
  const [status, setStatus] = useState<PaymentStatus | "All">("All");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const handleSearch = useCallback((value: string) => {
    setSearch(value);
    setPage(1);
  }, []);

  const load = useCallback(
    () => getAdminPaymentsPage({ status: status === "All" ? undefined : status, search: search || undefined, pageNumber: page }),
    [status, search, page],
  );
  const { data: payments, loading, failed, error } = useApiData(load);

  const list = payments?.items ?? [];
  const paidTotal = payments?.paidTotal ?? 0;
  const pending = list.filter((p) => p.status === "Pending").length;

  return (
    <>
      <ManageHeader eyebrow="Admin" title="Payments" description="Every payment made at the academy." links={ADMIN_LINKS} />

      <div className={cn(pageContainer, "flex flex-col gap-5 py-10")}>
        <div className="grid gap-4 sm:grid-cols-3">
          <StatTile label="Payments found" value={payments?.totalCount ?? 0} icon={Wallet} />
          <StatTile label="Paid (all results)" value={paidTotal} prefix="EGP " icon={Banknote} />
          <StatTile label="Pending (this page)" value={pending} icon={Hourglass} tone="warning" />
        </div>

        <div className="flex flex-wrap items-center justify-between gap-3">
          <div role="radiogroup" aria-label="Filter by status" className="flex flex-wrap gap-1.5">
            {FILTERS.map((filter) => (
              <button
                key={filter}
                type="button"
                role="radio"
                aria-checked={status === filter}
                onClick={() => {
                  setStatus(filter);
                  setPage(1);
                }}
                className={cn(
                  "rounded-full border px-4 py-1.5 text-sm font-medium transition outline-none focus-visible:ring-3 focus-visible:ring-ring/50",
                  status === filter
                    ? "border-primary bg-primary text-primary-foreground"
                    : "border-border bg-card text-muted-foreground hover:text-foreground",
                )}
              >
                {filter === "Paid" && status === filter && <CircleCheck aria-hidden className="mr-1 -ml-1 inline size-3.5" />}
                {filter}
              </button>
            ))}
          </div>
          <SearchInput value={search} onSearch={handleSearch} placeholder="Student or transaction" className="w-full sm:w-80" />
        </div>

        {loading && !payments ? (
          <PageSkeleton variant="table" label="Loading payments…" />
        ) : failed || !payments ? (
          <Alert variant="destructive">
            <AlertDescription>{getApiErrorMessage(error, "Could not load payments.")}</AlertDescription>
          </Alert>
        ) : payments.items.length === 0 ? (
          <EmptyNote icon={Banknote} title="No payments found" description="Try another status or search." />
        ) : (
          <TableCard title="Payments" description={`${payments.totalCount} found`}>
            <PaymentsTable payments={payments.items} detailed />
          </TableCard>
        )}

        {payments && payments.totalPages > 1 && (
          <CoursePagination page={page} totalPages={payments.totalPages} onPageChange={setPage} />
        )}
      </div>
    </>
  );
}

export default AdminPaymentsPage;
