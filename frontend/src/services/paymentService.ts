import api from "./api";
import type {
  ConfirmPaymentRequest,
  CreatePaymentRequest,
  Payment,
} from "../types/Payment";

// POST /api/payments → creates (or reuses) a Pending payment
export async function createPayment(
  payload: CreatePaymentRequest,
): Promise<Payment> {
  const response = await api.post<Payment>("/payments", payload);
  return response.data;
}

// POST /api/payments/{id}/confirm → Paid (enrolled) or Failed (declined)
export async function confirmPayment(
  id: number,
  payload: ConfirmPaymentRequest,
): Promise<Payment> {
  const response = await api.post<Payment>(`/payments/${id}/confirm`, payload);
  return response.data;
}

// GET /api/payments/me
export async function getMyPayments(): Promise<Payment[]> {
  const response = await api.get<Payment[]>("/payments/me");
  return response.data;
}
