import api from "./api";
import type {
  ConfirmPaymentRequest,
  CreatePaymentRequest,
  Payment,
} from "@/types/Payment";

// Creates a Pending payment for the application, or returns the one that already exists
export async function createPayment(
  payload: CreatePaymentRequest,
): Promise<Payment> {
  const response = await api.post<Payment>("/payments", payload);
  return response.data;
}

// The answer is either Paid (the learner is now enrolled) or Failed (card declined)
export async function confirmPayment(
  id: number,
  payload: ConfirmPaymentRequest,
): Promise<Payment> {
  const response = await api.post<Payment>(`/payments/${id}/confirm`, payload);
  return response.data;
}

export async function getMyPayments(): Promise<Payment[]> {
  const response = await api.get<Payment[]>("/payments/me");
  return response.data;
}
