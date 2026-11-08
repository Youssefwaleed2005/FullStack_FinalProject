import { ChartColumnBig, ChartPie } from "lucide-react";
import BarChart from "@/components/charts/BarChart";
import HorizontalBars from "@/components/charts/HorizontalBars";
import { Skeleton } from "@/components/ui/skeleton";
import { useApiData } from "@/hooks/useApiData";
import { panelStyle } from "@/lib/styles";
import { cn } from "@/lib/utils";
import { getAdminStats } from "@/services/adminService";

const compact = new Intl.NumberFormat("en", { notation: "compact", maximumFractionDigits: 1 });

// Admin overview: revenue for the last 6 months + enrollments per category
function AdminCharts() {
  const { data, loading } = useApiData(getAdminStats);

  if (loading)
    return (
      <div className="grid gap-4 lg:grid-cols-2">
        <Skeleton className="h-72 rounded-2xl" />
        <Skeleton className="h-72 rounded-2xl" />
      </div>
    );
  if (!data) return null;

  const total = data.revenueByMonth.reduce((sum, m) => sum + m.revenue, 0);

  return (
    <div className="grid gap-4 lg:grid-cols-2">
      <section className={cn(panelStyle, "p-6")}>
        <div className="flex items-start justify-between gap-3">
          <div>
            <h2 className="flex items-center gap-2 text-lg font-semibold">
              <ChartColumnBig aria-hidden className="size-5 text-sand-deep" /> Revenue per month
            </h2>
            <p className="text-sm text-muted-foreground">Paid payments, last 6 months</p>
          </div>
          <p className="text-right">
            <span className="block font-heading text-2xl font-semibold">EGP {total.toLocaleString()}</span>
            <span className="text-xs text-muted-foreground">in 6 months</span>
          </p>
        </div>
        <div className="mt-6">
          <BarChart
            title="Revenue per month"
            bars={data.revenueByMonth.map((m) => ({
              label: m.month.split(" ")[0],
              value: m.revenue,
              hint: `${m.month}: EGP ${m.revenue.toLocaleString()} from ${m.payments} payment${m.payments === 1 ? "" : "s"}`,
            }))}
            formatValue={(v) => compact.format(v)}
            barClassName="bg-linear-to-t from-primary to-sand-deep"
            height="h-44"
          />
        </div>
      </section>

      <section className={cn(panelStyle, "p-6")}>
        <h2 className="flex items-center gap-2 text-lg font-semibold">
          <ChartPie aria-hidden className="size-5 text-sand-deep" /> Enrollments per category
        </h2>
        <p className="text-sm text-muted-foreground">All enrollments, by the course or program's category</p>
        <div className="mt-6">
          {data.enrollmentsByCategory.length === 0 ? (
            <p className="text-sm text-muted-foreground">No enrollments yet.</p>
          ) : (
            <HorizontalBars
              title="Enrollments per category"
              items={data.enrollmentsByCategory.map((c) => ({ label: c.category, value: c.count }))}
            />
          )}
        </div>
      </section>
    </div>
  );
}

export default AdminCharts;
