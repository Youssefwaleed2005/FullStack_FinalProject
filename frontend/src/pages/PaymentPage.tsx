import { useEffect, useRef, useState } from "react";
import type { FormEvent } from "react";
import { Link, useParams } from "react-router-dom";
import axios from "axios";
import {
  Alert,
  Box,
  Button,
  CircularProgress,
  Container,
  Divider,
  Paper,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import InfoRow from "../components/InfoRow";
import { getApiErrorMessage } from "../services/api";
import { confirmPayment, createPayment } from "../services/paymentService";
import type { Payment } from "../types/Payment";

function PaymentPage() {
  const { applicationId } = useParams();
  const id = Number(applicationId);

  // Loading the pending payment
  const [payment, setPayment] = useState<Payment | null>(null);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");
  const [alreadyPaid, setAlreadyPaid] = useState(false);
  const [attempt, setAttempt] = useState(0); // +1 = create a new payment (after a decline)

  // Remembers the request for each attempt, so StrictMode's double effect
  // reuses it instead of creating a second payment
  const requestRef = useRef<{ attempt: number; promise: Promise<Payment> } | null>(null);

  // Card form
  const [cardHolderName, setCardHolderName] = useState("");
  const [cardNumber, setCardNumber] = useState("");
  const [expiry, setExpiry] = useState("");
  const [cvv, setCvv] = useState("");
  const [formError, setFormError] = useState("");
  const [paying, setPaying] = useState(false);

  // Step 1: create (or reuse) the Pending payment for this application
  useEffect(() => {
    let active = true;

    // Only send ONE request per attempt
    if (!requestRef.current || requestRef.current.attempt !== attempt) {
      requestRef.current = {
        attempt,
        promise: createPayment({ applicationId: id, method: "Card" }),
      };
    }

    requestRef.current.promise
      .then((data) => {
        if (active) setPayment(data);
      })
      .catch((err) => {
        if (!active) return;
        // 409 = this application is already paid
        if (axios.isAxiosError(err) && err.response?.status === 409) {
          setAlreadyPaid(true);
        } else {
          setLoadError(getApiErrorMessage(err, "Could not start the payment."));
        }
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, [id, attempt]);

  // Same rules as the backend DTO
  function validate(): string {
    if (!cardHolderName.trim()) return "Enter the card holder name.";
    if (!/^\d{16}$/.test(cardNumber)) return "Card number must be 16 digits.";
    if (!/^(0[1-9]|1[0-2])\/\d{2}$/.test(expiry))
      return "Expiry must be in MM/YY format.";
    if (!/^\d{3}$/.test(cvv)) return "CVV must be 3 digits.";
    return "";
  }

  // Step 2: confirm the payment with the card details
  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    if (!payment) return;

    const problem = validate();
    if (problem) {
      setFormError(problem);
      return;
    }

    setFormError("");
    setPaying(true);
    try {
      const result = await confirmPayment(payment.id, {
        cardHolderName: cardHolderName.trim(),
        cardNumber,
        expiry,
        cvv,
      });
      setPayment(result); // status is now "Paid" or "Failed"
    } catch (err) {
      setFormError(getApiErrorMessage(err, "Payment could not be completed."));
    } finally {
      setPaying(false);
    }
  }

  // After a decline: clear the card and create a new pending payment
  function handleTryAgain() {
    setPayment(null);
    setCardNumber("");
    setCvv("");
    setFormError("");
    setLoading(true);
    setAttempt((a) => a + 1);
  }

  // Auto-format MM/YY while typing
  function handleExpiryChange(value: string) {
    const digits = value.replace(/\D/g, "").slice(0, 4);
    setExpiry(
      digits.length > 2 ? `${digits.slice(0, 2)}/${digits.slice(2)}` : digits,
    );
  }

  if (loading) {
    return (
      <Container sx={{ py: 8, textAlign: "center" }}>
        <CircularProgress />
      </Container>
    );
  }

  if (alreadyPaid) {
    return (
      <Container maxWidth="sm" sx={{ py: 8 }}>
        <Alert severity="info" sx={{ mb: 2 }}>
          This application is already paid. You are enrolled.
        </Alert>
        <Button
          component={Link}
          to="/my-payments"
          variant="contained"
          color="secondary"
        >
          View my payments
        </Button>
      </Container>
    );
  }

  if (loadError || !payment) {
    return (
      <Container maxWidth="sm" sx={{ py: 8 }}>
        <Alert severity="error" sx={{ mb: 2 }}>
          {loadError || "Payment not found."}
        </Alert>
        <Button component={Link} to="/courses" color="secondary">
          Back to courses
        </Button>
      </Container>
    );
  }

  const amountText = `${payment.amount} ${payment.currency}`;
  const targetText = `${payment.targetType}: ${payment.targetTitle}`;

  // Success screen
  if (payment.status === "Paid") {
    return (
      <Container maxWidth="sm" sx={{ py: { xs: 4, md: 8 } }}>
        <Paper sx={{ p: { xs: 3, md: 4 } }}>
          <Alert severity="success" sx={{ mb: 3 }}>
            Payment successful. You are now enrolled!
          </Alert>
          <InfoRow label="For" value={targetText} />
          <InfoRow label="Amount" value={amountText} />
          <InfoRow label="Transaction ID" value={payment.transactionId} />
          <InfoRow
            label="Paid at"
            value={
              payment.paidAt ? new Date(payment.paidAt).toLocaleString() : null
            }
          />
          <Stack direction="row" spacing={2} sx={{ mt: 3 }}>
            <Button
              component={Link}
              to="/my-payments"
              variant="contained"
              color="secondary"
            >
              My payments
            </Button>
            <Button component={Link} to="/courses" color="secondary">
              Browse courses
            </Button>
          </Stack>
        </Paper>
      </Container>
    );
  }

  // Pending (form) or Failed (declined)
  return (
    <Container maxWidth="sm" sx={{ py: { xs: 4, md: 8 } }}>
      <Paper sx={{ p: { xs: 3, md: 4 } }}>
        <Typography variant="h5" sx={{ mb: 2 }}>
          Payment
        </Typography>
        <InfoRow label="For" value={targetText} />
        <InfoRow label="Amount" value={amountText} />
        <Divider sx={{ my: 2 }} />

        {payment.status === "Failed" ? (
          <>
            <Alert severity="error" sx={{ mb: 2 }}>
              Your card was declined. No money was taken.
            </Alert>
            <Button
              variant="contained"
              color="secondary"
              onClick={handleTryAgain}
            >
              Try again
            </Button>
          </>
        ) : (
          <>
            <Alert severity="info" sx={{ mb: 2 }}>
              This is a payment simulation, no real money is charged. Use any
              16-digit card number. A card ending in 0000 will be declined.
            </Alert>

            {formError && (
              <Alert severity="error" sx={{ mb: 2 }}>
                {formError}
              </Alert>
            )}

            <Box component="form" onSubmit={handleSubmit} noValidate>
              <TextField
                fullWidth
                margin="normal"
                label="Card holder name"
                value={cardHolderName}
                onChange={(e) => setCardHolderName(e.target.value)}
              />
              <TextField
                fullWidth
                margin="normal"
                label="Card number"
                placeholder="1234567812345678"
                value={cardNumber}
                onChange={(e) =>
                  setCardNumber(e.target.value.replace(/\D/g, "").slice(0, 16))
                }
              />
              <Stack direction="row" spacing={2}>
                <TextField
                  fullWidth
                  margin="normal"
                  label="Expiry (MM/YY)"
                  placeholder="12/28"
                  value={expiry}
                  onChange={(e) => handleExpiryChange(e.target.value)}
                />
                <TextField
                  fullWidth
                  margin="normal"
                  label="CVV"
                  placeholder="123"
                  value={cvv}
                  onChange={(e) =>
                    setCvv(e.target.value.replace(/\D/g, "").slice(0, 3))
                  }
                />
              </Stack>

              <Button
                type="submit"
                variant="contained"
                color="secondary"
                fullWidth
                disabled={paying}
                sx={{ mt: 2 }}
              >
                {paying ? <CircularProgress size={24} /> : `Pay ${amountText}`}
              </Button>
            </Box>
          </>
        )}
      </Paper>
    </Container>
  );
}

export default PaymentPage;
