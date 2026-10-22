import { useEffect, useRef, useState, type FormEvent } from "react";
import { Link, useParams } from "react-router-dom";
import {
  CircleAlert,
  CircleCheck,
  CloudOff,
  CreditCard,
  Info,
  LoaderCircle,
  RotateCw,
} from "lucide-react";
import DetailRow from "@/components/DetailRow";
import FormField from "@/components/FormField";
import LoadingState from "@/components/LoadingState";
import StateMessage from "@/components/StateMessage";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { useCelebrate } from "@/hooks/useCelebrate";
import { formatAmount, formatDateTime } from "@/lib/course";
import { panelStyle } from "@/lib/styles";
import { cn } from "@/lib/utils";
import { getApiErrorMessage, hasStatus } from "@/services/api";
import { confirmPayment, createPayment } from "@/services/paymentService";
import type { Payment } from "@/types/Payment";

// Same rules as the backend
function validateCard(card: {
  cardHolderName: string;
  cardNumber: string;
  expiry: string;
  cvv: string;
}): string {
  if (!card.cardHolderName.trim()) return "Enter the card holder name.";
  if (!/^\d{16}$/.test(card.cardNumber)) return "Card number must be 16 digits.";
  if (!/^(0[1-9]|1[0-2])\/\d{2}$/.test(card.expiry))
    return "Expiry must be in MM/YY format.";
  if (!/^\d{3}$/.test(card.cvv)) return "CVV must be 3 digits.";
  return "";
}

// Shows the number in groups of four while typing: 1234 5678 …
function groupCardNumber(digits: string): string {
  return digits.replace(/(\d{4})(?=\d)/g, "$1 ");
}

// Reads the id from the URL and gives each application its own fresh checkout
function PaymentPage() {
  const { applicationId } = useParams();
  return <PaymentContent key={applicationId} id={Number(applicationId)} />;
}

type PaymentContentProps = {
  id: number;
};

function PaymentContent({ id }: PaymentContentProps) {
  // Loading the pending payment
  const { celebrate } = useCelebrate();
  const [payment, setPayment] = useState<Payment | null>(null);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");
  const [alreadyPaid, setAlreadyPaid] = useState(false);
  // Goes up by one to create a fresh payment after a decline
  const [attempt, setAttempt] = useState(0);

  // Remembers the request for each attempt, so StrictMode's double effect
  // reuses it instead of creating a second payment
  const requestRef = useRef<{
    attempt: number;
    promise: Promise<Payment>;
  } | null>(null);

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
      .catch((error: unknown) => {
        if (!active) return;
        // 409 means this application is already paid
        if (hasStatus(error, 409)) setAlreadyPaid(true);
        else setLoadError(getApiErrorMessage(error, "Could not start the payment."));
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, [id, attempt]);

  // Step 2: confirm the payment with the card details
  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    if (!payment) return;

    const problem = validateCard({ cardHolderName, cardNumber, expiry, cvv });
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
      // The status is now "Paid" or "Failed"
      setPayment(result);
      if (result.status === "Paid") {
        celebrate({
          big: true,
          title: "You're enrolled!",
          message: "Payment successful. Welcome to the course!",
        });
      }
    } catch (error) {
      setFormError(getApiErrorMessage(error, "Payment could not be completed."));
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
    setAttempt((current) => current + 1);
  }

  // Adds the "/" in MM/YY while typing
  function handleExpiryChange(value: string) {
    const digits = value.replace(/\D/g, "").slice(0, 4);
    setExpiry(
      digits.length > 2 ? `${digits.slice(0, 2)}/${digits.slice(2)}` : digits,
    );
  }

  if (loading) return <LoadingState label="Preparing your payment…" />;

  if (alreadyPaid) {
    return (
      <div className="flex flex-1 items-center justify-center">
        <StateMessage
          icon={CircleCheck}
          title="Already paid"
          description="This application is already paid, so you are enrolled."
          action={
            <Button asChild size="lg" className="rounded-full px-5">
              <Link to="/my-payments">View my payments</Link>
            </Button>
          }
        />
      </div>
    );
  }

  if (loadError || !payment) {
    return (
      <div className="flex flex-1 items-center justify-center">
        <StateMessage
          icon={CloudOff}
          title="We couldn't start the payment"
          description={loadError || "Payment not found."}
          action={
            <Button asChild size="lg" variant="outline" className="rounded-full px-5">
              <Link to="/applications">Back to my applications</Link>
            </Button>
          }
        />
      </div>
    );
  }

  const amountText = formatAmount(payment.amount, payment.currency);

  return (
    <div className="relative flex flex-1 justify-center overflow-hidden bg-linear-to-b from-secondary/70 to-background px-4 py-12 sm:py-16">
      <div
        aria-hidden
        className="pointer-events-none absolute -top-32 right-0 size-112 rounded-full bg-sand/20 blur-3xl"
      />

      <div className={cn(panelStyle, "relative h-fit w-full max-w-lg p-6 shadow-xl shadow-primary/5 sm:p-9")}>
        {payment.status === "Paid" ? (
          // Success
          <>
            <span
              aria-hidden
              className="flex size-14 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600"
            >
              <CircleCheck className="size-7" strokeWidth={1.75} />
            </span>
            <h1 className="mt-5 text-3xl font-semibold">Payment successful</h1>
            <p className="mt-2 text-sm text-muted-foreground">
              You are now enrolled. Welcome aboard!
            </p>

            <dl className="mt-6 divide-y border-y">
              <DetailRow label={payment.targetType} value={payment.targetTitle} />
              <DetailRow label="Amount" value={amountText} />
              <DetailRow label="Transaction ID" value={payment.transactionId} />
              <DetailRow
                label="Paid at"
                value={payment.paidAt ? formatDateTime(payment.paidAt) : null}
              />
            </dl>

            <div className="mt-7 flex flex-wrap gap-3">
              <Button asChild size="lg" className="rounded-full px-5">
                <Link to="/my-enrollments">Go to my learning</Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="rounded-full px-5">
                <Link to="/my-payments">My payments</Link>
              </Button>
            </div>
          </>
        ) : (
          // Pending (card form) or Failed (declined)
          <>
            <p className="text-xs font-semibold tracking-[0.2em] text-sand-deep uppercase">
              Checkout
            </p>
            <h1 className="mt-2 text-3xl font-semibold">Payment</h1>

            <dl className="mt-6 divide-y border-y">
              <DetailRow label={payment.targetType} value={payment.targetTitle} />
              <DetailRow label="Amount" value={amountText} />
            </dl>

            {payment.status === "Failed" ? (
              <>
                <Alert variant="destructive" className="mt-6">
                  <CircleAlert />
                  <AlertDescription>
                    Your card was declined. No money was taken.
                  </AlertDescription>
                </Alert>
                <Button
                  size="lg"
                  className="mt-5 h-11 w-full rounded-full text-base"
                  onClick={handleTryAgain}
                >
                  <RotateCw data-icon="inline-start" />
                  Try again
                </Button>
              </>
            ) : (
              <>
                <Alert className="mt-6 border-sand/60 bg-accent/60">
                  <Info />
                  <AlertDescription className="text-accent-foreground/80">
                    This is a payment simulation, no real money is charged. Use
                    any 16-digit card number. A card ending in 0000 will be
                    declined.
                  </AlertDescription>
                </Alert>

                {formError && (
                  <Alert variant="destructive" className="mt-4">
                    <CircleAlert />
                    <AlertDescription>{formError}</AlertDescription>
                  </Alert>
                )}

                <form
                  onSubmit={handleSubmit}
                  noValidate
                  className="mt-6 grid grid-cols-2 gap-5"
                >
                  <FormField
                    label="Card holder name"
                    autoComplete="cc-name"
                    className="col-span-2"
                    value={cardHolderName}
                    onChange={(event) => setCardHolderName(event.target.value)}
                  />
                  <FormField
                    label="Card number"
                    inputMode="numeric"
                    autoComplete="cc-number"
                    placeholder="1234 5678 1234 5678"
                    className="col-span-2"
                    value={groupCardNumber(cardNumber)}
                    onChange={(event) =>
                      setCardNumber(
                        event.target.value.replace(/\D/g, "").slice(0, 16),
                      )
                    }
                  />
                  <FormField
                    label="Expiry (MM/YY)"
                    inputMode="numeric"
                    autoComplete="cc-exp"
                    placeholder="12/28"
                    value={expiry}
                    onChange={(event) => handleExpiryChange(event.target.value)}
                  />
                  <FormField
                    label="CVV"
                    inputMode="numeric"
                    autoComplete="cc-csc"
                    placeholder="123"
                    value={cvv}
                    onChange={(event) =>
                      setCvv(event.target.value.replace(/\D/g, "").slice(0, 3))
                    }
                  />

                  <Button
                    type="submit"
                    size="lg"
                    disabled={paying}
                    className="col-span-2 mt-1 h-12 rounded-full text-base"
                  >
                    {paying ? (
                      <LoaderCircle data-icon="inline-start" className="animate-spin" />
                    ) : (
                      <CreditCard data-icon="inline-start" />
                    )}
                    {paying ? "Processing…" : `Pay ${amountText}`}
                  </Button>
                </form>
              </>
            )}
          </>
        )}
      </div>
    </div>
  );
}

export default PaymentPage;
