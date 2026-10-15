export type PaymentStatus = "Pending" | "Paid" | "Failed" | "Refunded";
export type PaymentMethod = "Card" | "Cash" | "BankTransfer";

export type Payment = {
  id: number;
  applicationId: number;
  amount: number;
  currency: string;
  method: PaymentMethod;
  status: PaymentStatus;
  transactionId: string | null;
  createdAt: string;
  paidAt: string | null;
  targetType: "Course" | "Program";
  targetTitle: string;
  enrollmentId: number | null;
};

export type CreatePaymentRequest = {
  applicationId: number;
  method: PaymentMethod;
};

export type ConfirmPaymentRequest = {
  cardHolderName: string;
  cardNumber: string; // 16 digits
  expiry: string; // MM/YY
  cvv: string; // 3 digits
};
