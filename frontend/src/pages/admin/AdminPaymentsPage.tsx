import { useCallback, useEffect, useState } from "react";
import type { FormEvent } from "react";
import {
  Alert,
  Box,
  Button,
  Chip,
  CircularProgress,
  Container,
  MenuItem,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from "@mui/material";
import { getApiErrorMessage } from "../../services/api";
import { getAdminPayments } from "../../services/adminService";
import type { AdminPayment } from "../../types/Admin";
import type { PaymentStatus } from "../../types/Payment";
import { PAYMENT_STATUS_COLORS } from "../../utils/statusLabels";
import { formatDateTime } from "../../utils/formatDate";

const STATUSES: (PaymentStatus | "All")[] = ["All", "Paid", "Pending", "Failed", "Refunded"];

function AdminPaymentsPage() {
  const [payments, setPayments] = useState<AdminPayment[]>([]);
  const [status, setStatus] = useState<PaymentStatus | "All">("All");
  const [searchInput, setSearchInput] = useState("");
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const load = useCallback(async () => {
    setLoading(true);
    try {
      setPayments(
        await getAdminPayments({
          status: status === "All" ? undefined : status,
          search: search || undefined,
        }),
      );
      setError("");
    } catch (err) {
      setError(getApiErrorMessage(err, "Could not load payments."));
    } finally {
      setLoading(false);
    }
  }, [status, search]);

  useEffect(() => {
    load();
  }, [load]);

  function handleSearch(event: FormEvent) {
    event.preventDefault();
    setSearch(searchInput.trim());
  }

  const paidTotal = payments
    .filter((p) => p.status === "Paid")
    .reduce((sum, p) => sum + p.amount, 0);

  return (
    <Container sx={{ py: { xs: 4, md: 6 } }}>
      <Typography variant="h4" sx={{ mb: 3 }}>
        Payments
      </Typography>

      {/* Filters */}
      <Box
        component="form"
        onSubmit={handleSearch}
        sx={{ display: "flex", flexWrap: "wrap", gap: 1, mb: 2 }}
      >
        <TextField
          select
          size="small"
          label="Status"
          value={status}
          onChange={(e) => setStatus(e.target.value as PaymentStatus | "All")}
          sx={{ minWidth: 150, bgcolor: "background.paper" }}
        >
          {STATUSES.map((s) => (
            <MenuItem key={s} value={s}>
              {s}
            </MenuItem>
          ))}
        </TextField>
        <TextField
          size="small"
          label="Student or transaction"
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
          sx={{ flexGrow: 1, maxWidth: 360, bgcolor: "background.paper" }}
        />
        <Button type="submit" variant="outlined" color="secondary">
          Search
        </Button>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      {loading ? (
        <CircularProgress />
      ) : payments.length === 0 ? (
        <Typography sx={{ color: "text.secondary" }}>No payments found.</Typography>
      ) : (
        <>
          <Typography sx={{ mb: 1 }}>
            {payments.length} payments · <strong>{paidTotal.toLocaleString()} EGP</strong> paid
          </Typography>
          <TableContainer component={Paper}>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell>Student</TableCell>
                  <TableCell>For</TableCell>
                  <TableCell align="right">Amount</TableCell>
                  <TableCell>Method</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Transaction</TableCell>
                  <TableCell>Date</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {payments.map((p) => (
                  <TableRow key={p.id}>
                    <TableCell>
                      <Typography variant="body2" sx={{ fontWeight: 600 }}>
                        {p.studentName}
                      </Typography>
                      <Typography variant="caption" sx={{ color: "text.secondary" }}>
                        {p.studentEmail}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      {p.targetType}: {p.targetTitle}
                    </TableCell>
                    <TableCell align="right">
                      {p.amount.toLocaleString()} {p.currency}
                    </TableCell>
                    <TableCell>{p.method}</TableCell>
                    <TableCell>
                      <Chip size="small" label={p.status} color={PAYMENT_STATUS_COLORS[p.status]} />
                    </TableCell>
                    <TableCell>
                      <Typography variant="caption">{p.transactionId ?? "-"}</Typography>
                    </TableCell>
                    <TableCell>{formatDateTime(p.paidAt ?? p.createdAt)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </>
      )}
    </Container>
  );
}

export default AdminPaymentsPage;
