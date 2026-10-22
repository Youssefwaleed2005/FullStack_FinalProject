import PersonCell from "@/components/manage/PersonCell";
import StatusPill from "@/components/StatusPill";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { formatAmount, formatDateTime } from "@/lib/course";
import { PAYMENT_STATUS_META } from "@/lib/status";
import type { AdminPayment } from "@/types/Admin";

const METHOD_LABELS: Record<AdminPayment["method"], string> = {
  Card: "Card",
  Cash: "Cash",
  BankTransfer: "Bank transfer",
};

// Payments list shared by the admin overview and the payments page
function PaymentsTable({ payments, detailed = false }: { payments: AdminPayment[]; detailed?: boolean }) {
  return (
    <Table>
      <TableHeader>
        <TableRow className="hover:bg-transparent">
          <TableHead>Student</TableHead>
          <TableHead>For</TableHead>
          <TableHead className="text-right">Amount</TableHead>
          {detailed && <TableHead>Method</TableHead>}
          <TableHead>Status</TableHead>
          {detailed && <TableHead>Transaction</TableHead>}
          <TableHead>Date</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {payments.map((payment) => (
          <TableRow key={payment.id}>
            <TableCell>
              <PersonCell name={payment.studentName} detail={payment.studentEmail} />
            </TableCell>
            <TableCell className="max-w-64">
              <p className="truncate font-medium">{payment.targetTitle}</p>
              <p className="text-xs text-muted-foreground">{payment.targetType}</p>
            </TableCell>
            <TableCell className="text-right font-medium whitespace-nowrap tabular-nums">
              {formatAmount(payment.amount, payment.currency)}
            </TableCell>
            {detailed && <TableCell className="whitespace-nowrap">{METHOD_LABELS[payment.method]}</TableCell>}
            <TableCell>
              <StatusPill status={PAYMENT_STATUS_META[payment.status]} />
            </TableCell>
            {detailed && (
              <TableCell className="font-mono text-xs text-muted-foreground">{payment.transactionId ?? "–"}</TableCell>
            )}
            <TableCell className="whitespace-nowrap text-muted-foreground">
              {formatDateTime(payment.paidAt ?? payment.createdAt)}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}

export default PaymentsTable;
