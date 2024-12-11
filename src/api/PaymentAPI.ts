import { BACKEND_API_URL } from "../constant/AppConstant";
import { axiosInstance } from "./axios/axiosInstance";

export interface BookingPaymentRequest {
  bookingId: string;
  paymentMethod: string;
  paymentReturnUrl: string;
}

export interface PaymentResponse {
  status: string;
  message: string;
  paymentUrl: string;
}
export async function pay(request: BookingPaymentRequest) {
  const res = await axiosInstance.post(
    `${BACKEND_API_URL}/ticket/to-payment`,
    JSON.stringify(request)
  );

  if (res.status !== 200 && res.status !== 301) {
    // throw new Error("Failed to pay");
  }

  const json = (await res.data) as PaymentResponse;

  return json;
}
