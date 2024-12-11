import { BACKEND_API_URL } from "../constant/AppConstant";
import { ApiResponse } from "../domain/CommonDomain";
import { axiosInstance } from "./axios/axiosInstance";
import { Location } from "./LocationAPI";

export interface searchFlightRequest {
  sourceId: number;
  destinationId: number;
  date: string;
  class: string;
}

export interface Flights {
  id: number;
  flightCode: string;
  airplaneClassOptionId: string;
  flightClassDetails: FlightClassDetail[];
  departDate: string;
  estimatedArrivedDate: string;
  departureAirport: Airport;
  destinationAirport: Airport;
  departureLocation: Location;
  destination: Location;
  airlineId: number;
  airlineName: string;
}

export interface FlightClassDetail {
  flightId: number;
  airplaneFlightClassId: number;
  flightClass: string;
  fare: number;
  availableSeatCount: number;
}

export interface FlightSeatOption {
  id: number;
  seatType: string;
  seatFare: number;
  description: string;
  available: number;
  totalSeat: number;
}
export interface Airport {
  id: number;
  name: string;
  address: string;
}
export async function searchFlight(request: searchFlightRequest) {
  const res = await axiosInstance.get(
    `${BACKEND_API_URL}/flights/search?from=${request.sourceId}&to=${
      request.destinationId
    }&page=${1}`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    }
  );

  const json = res.data as ApiResponse<Flights[]>;

  return json.data;
}

export async function getById(id: number): Promise<Flights> {
  const res = await axiosInstance.get(`${BACKEND_API_URL}/flights/${id}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });

  const json = res.data as ApiResponse<Flights>;

  return json.data;
}

// export async function getFlightClassesDetail(flightId: number) : Promise<FlightClassFare> {
//   const res = await axios(`${BACKEND_API_URL}/flights/${flightId}/class/${airplaneClassOptionId}`, {
//     method: "GET",
//     headers: {
//       "Content-Type": "application/json",
//     },
//   });

//   const json = (await res.json()) as ApiResponse<FlightClassFare>;

//   return json.data;
// }

export interface FlightSeat {
  id: number;
  seatCode: string;
  flightClass: string;
  available: boolean;
}

export async function getFlightSeats(flightCode: string) {
  const res = await axiosInstance.get(
    `${BACKEND_API_URL}/seat/info?flightCode=${flightCode}`
  );
  if (res.status !== 200) {
    throw new Error("Failed to axios flight seats");
  }
  const json = res.data as ApiResponse<FlightSeat[]>;
  return json.data;
}
