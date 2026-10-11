import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  Alert,
  Box,
  Button,
  Chip,
  CircularProgress,
  Container,
  Paper,
  Stack,
  Typography,
} from "@mui/material";
import { getApiErrorMessage } from "../services/api";
import { getMyPayments } from "../services/paymentService";
import type { Payment, PaymentStatus } from "../types/Payment";

// Chip color for each status
const STATUS_COLORS: Record<
  PaymentStatus,
  "success" | "warning" | "error" | "default"
> = {
  Paid: "success",
  Pending: "warning",
  Failed: "error",
  Refunded: "default",
};

function formatDate(value: string | null): string {
  return value ? new Date(value).toLocaleString() : "-";
}

function MyPaymentsPage() {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;
    getMyPayments()
      .then((data) => {
        if (active) setPayments(data);
      })
      .catch((err) => {
        if (active)
          setError(getApiErrorMessage(err, "Could not load your payments."));
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, []);

  if (loading) {
    return (
      <Container sx={{ py: 8, textAlign: "center" }}>
        <CircularProgress />
      </Container>
    );
  }

  if (error) {
    return (
      <Container sx={{ py: 8 }}>
        <Alert severity="error">{error}</Alert>
      </Container>
    );
  }

  return (
    <Container maxWidth="md" sx={{ py: { xs: 4, md: 8 } }}>
      <Typography variant="h4" sx={{ mb: 3 }}>
        My payments
      </Typography>

      {/* Empty state */}
      {payments.length === 0 ? (
        <Paper sx={{ p: 4, textAlign: "center" }}>
          <Typography sx={{ mb: 2 }}>You have no payments yet.</Typography>
          <Button
            component={Link}
            to="/courses"
            variant="contained"
            color="secondary"
          >
            Browse courses
          </Button>
        </Paper>
      ) : (
        <Stack spacing={2}>
          {payments.map((payment) => (
            <Paper key={payment.id} sx={{ p: 3 }}>
              <Box
                sx={{
                  display: "flex",
                  flexWrap: "wrap",
                  justifyContent: "space-between",
                  alignItems: "center",
                  gap: 2,
                }}
              >
                {/* Left: what it was for */}
                <Box>
                  <Typography
                    variant="caption"
                    sx={{ color: "text.secondary" }}
                  >
                    {payment.targetType}
                  </Typography>
                  <Typography variant="h6">{payment.targetTitle}</Typography>
                  <Typography variant="body2" sx={{ color: "text.secondary" }}>
                    Created: {formatDate(payment.createdAt)}
                  </Typography>
                  {payment.paidAt && (
                    <Typography
                      variant="body2"
                      sx={{ color: "text.secondary" }}
                    >
                      Paid: {formatDate(payment.paidAt)}
                    </Typography>
                  )}
                  {payment.transactionId && (
                    <Typography
                      variant="body2"
                      sx={{ color: "text.secondary" }}
                    >
                      Transaction: {payment.transactionId}
                    </Typography>
                  )}
                </Box>

                {/* Right: amount, status, action */}
                <Box sx={{ textAlign: { xs: "left", sm: "right" } }}>
                  <Typography variant="h6">
                    {payment.amount} {payment.currency}
                  </Typography>
                  <Chip
                    label={payment.status}
                    color={STATUS_COLORS[payment.status]}
                    size="small"
                    sx={{ mt: 1 }}
                  />
                  {/* Unpaid → let them finish paying */}
                  {payment.status === "Pending" && (
                    <Box sx={{ mt: 1 }}>
                      <Button
                        component={Link}
                        to={`/payment/${payment.applicationId}`}
                        size="small"
                        variant="outlined"
                        color="secondary"
                      >
                        Complete payment
                      </Button>
                    </Box>
                  )}
                </Box>
              </Box>
            </Paper>
          ))}
        </Stack>
      )}
    </Container>
  );
}

export default MyPaymentsPage;
