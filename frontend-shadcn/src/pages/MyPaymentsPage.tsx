import { Link } from "react-router-dom";
import { CloudOff, CreditCard } from "lucide-react";
import AccountLayout from "@/components/AccountLayout";
import LoadingState from "@/components/LoadingState";
import StateMessage from "@/components/StateMessage";
import StatusPill from "@/components/StatusPill";
import { Button } from "@/components/ui/button";
import { useApiData } from "@/hooks/useApiData";
import { formatAmount, formatDateTime } from "@/lib/course";
import { PAYMENT_STATUS_META } from "@/lib/status";
import { panelStyle } from "@/lib/styles";
import { cn } from "@/lib/utils";
import { getApiErrorMessage } from "@/services/api";
import { getMyPayments } from "@/services/paymentService";
import type { Payment } from "@/types/Payment";

function MyPaymentsPage() {
  const { data, loading, failed, error } = useApiData(getMyPayments);

  return (
    <AccountLayout
      title="My payments"
      description="Every payment you have made or started."
    >
      {loading && <LoadingState label="Loading your payments…" />}

      {failed && (
        <StateMessage
          icon={CloudOff}
          title="Something went wrong"
          description={getApiErrorMessage(error, "Could not load your payments.")}
        />
      )}

      {data && data.length === 0 && (
        <StateMessage
          icon={CreditCard}
          title="No payments yet"
          description="When you apply to a course or program, its payment will show up here."
          action={
            <Button asChild size="lg" className="rounded-full px-5">
              <Link to="/courses">Browse courses</Link>
            </Button>
          }
        />
      )}

      {data && data.length > 0 && (
        <ul className="flex flex-col gap-4">
          {data.map((payment) => (
            <li key={payment.id}>
              <PaymentItem payment={payment} />
            </li>
          ))}
        </ul>
      )}
    </AccountLayout>
  );
}

type PaymentItemProps = {
  payment: Payment;
};

function PaymentItem({ payment }: PaymentItemProps) {
  return (
    <article
      className={cn(
        panelStyle,
        "flex flex-col gap-5 p-5 sm:flex-row sm:items-start sm:justify-between sm:p-6",
      )}
    >
      {/* What it was for */}
      <div className="min-w-0">
        <p className="text-xs font-semibold tracking-[0.14em] text-sand-deep uppercase">
          {payment.targetType}
        </p>
        <h2 className="mt-1.5 text-xl leading-snug font-semibold">
          {payment.targetTitle}
        </h2>
        <dl className="mt-3 grid gap-1 text-sm text-muted-foreground">
          <div className="flex gap-1.5">
            <dt>Created:</dt>
            <dd>{formatDateTime(payment.createdAt)}</dd>
          </div>
          {payment.paidAt && (
            <div className="flex gap-1.5">
              <dt>Paid:</dt>
              <dd>{formatDateTime(payment.paidAt)}</dd>
            </div>
          )}
          {payment.transactionId && (
            <div className="flex gap-1.5">
              <dt>Transaction:</dt>
              <dd className="font-mono text-xs leading-5 break-all">
                {payment.transactionId}
              </dd>
            </div>
          )}
        </dl>
      </div>

      {/* Amount, status and what to do next */}
      <div className="flex shrink-0 flex-wrap items-center gap-3 sm:flex-col sm:items-end">
        <p className="text-lg font-semibold">
          {formatAmount(payment.amount, payment.currency)}
        </p>
        <StatusPill status={PAYMENT_STATUS_META[payment.status]} />
        {/* Not paid yet: let them finish */}
        {payment.status === "Pending" && (
          <Button asChild variant="outline" className="rounded-full px-4">
            <Link to={`/payment/${payment.applicationId}`}>
              Complete payment
            </Link>
          </Button>
        )}
      </div>
    </article>
  );
}

export default MyPaymentsPage;
