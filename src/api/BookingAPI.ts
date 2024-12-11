import { BACKEND_API_URL } from "../constant/AppConstant";
import { ApiResponse } from "../domain/CommonDomain";
import { axiosInstance } from "./axios/axiosInstance";

export interface BookRequest {
  flightId: string;
  airplaneClassOptionId: string;
  name: string;
  dob: string;
  email: string;
  phoneNumber: string;
  address: string;
  city: string;
  country: string;
  identityCard: string;
}

export interface BookingResponse {
  ticketId: string;
}

export async function bookFlight(
  request: BookRequest
): Promise<BookingResponse> {
  const res = await axiosInstance.post(
    `${BACKEND_API_URL}/ticket/book`,
    JSON.stringify(request)
  );

  if (res.status !== 200) {
    throw new Error("Failed to book flight");
  }

  const json = res.data;
  console.log(json);
  const bookingResponse = json["booking-info"] as BookingResponse;

  return bookingResponse;
}

export interface Ticket {
  id: string;
  ownerName: string;
  ownerDateOfBirth: string;
  ownerIdentityCard: string;
  fare: number;
  flightCode: string;
  flightDate: string;
  flightClass: string;
  seatCode: string;
  bookedById: string;
  bookedByName: string;
  status: string;
  statusCode: number;
  airlineName: string;
  bookedDate: string;
}

export async function getTicketById(id: string): Promise<Ticket> {
  const res = await axiosInstance.get(
    `${BACKEND_API_URL}/user/me/ticket?id=${id}`
  );

  const json = res.data as ApiResponse<Ticket>;

  return json.data;
}

export async function cancelTicket(ticketId: string): Promise<void> {
  const res = await axiosInstance.post(
    `${BACKEND_API_URL}/ticket/cancel`,
    JSON.stringify({ ticketId })
  );

  if (res.status !== 200) {
    throw new Error("Failed to cancel ticket");
  }

  return;
}

export interface CheckInRequest {
  ticketId: string;
  seatCode: string;
}

export async function checkIn(CheckInRequest: CheckInRequest): Promise<void> {
  const res = await axiosInstance.post(
    `${BACKEND_API_URL}/ticket/checkin`,
    JSON.stringify(CheckInRequest)
  );

  if (res.status !== 200) {
    throw new Error("Failed to check in");
  }

  return;
}
