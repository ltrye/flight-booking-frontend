import { BACKEND_API_URL } from "../constant/AppConstant";
import { ApiResponse } from "../domain/CommonDomain";
import { axiosInstance } from "./axios/axiosInstance";
import { Ticket } from "./BookingAPI";

export async function getMyTicketById(ticketId: string): Promise<Ticket> {
  const res = await axiosInstance.get(
    `${BACKEND_API_URL}/user/me/ticket?id=${ticketId}`
  );

  if (res.status !== 200) {
    throw new Error("Failed to fetch ticket");
  }

  const json = res.data as ApiResponse<Ticket>;
  return json.data;
}

export async function getMyTickets(): Promise<Ticket[]> {
  const res = await axiosInstance.get(`${BACKEND_API_URL}/user/me/tickets`);

  if (res.status !== 200) {
    throw new Error("Failed to fetch ticket");
  }

  const json = (await res.data) as ApiResponse<Ticket[]>;
  return json.data;
}
