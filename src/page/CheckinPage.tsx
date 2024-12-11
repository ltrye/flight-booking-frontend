import { useEffect, useState } from "react";
import { checkIn, Ticket } from "../api/BookingAPI";
import { getMyTicketById } from "../api/UserTicketAPI";
import { useRequestQuery } from "../hooks/useRequestQuery";
import { FlightSeat, getFlightSeats } from "../api/FlightAPI";
import { Modal } from "../component/Modal";
import { useQuery } from "@tanstack/react-query";
import { SimpleLoadingScreen } from "../component/SimpleLoading";

function useGetTicketByQuery() {
  const ticketId = useRequestQuery().get("ticketId");
  const [ticket, setTicket] = useState<Ticket>();

  const { data, isSuccess, isLoading, isError } = useQuery({
    queryKey: ["ticket", ticketId],
    queryFn: async () => {
      if (!ticketId) {
        return;
      }
      return await getMyTicketById(ticketId);
    },
    retry: false,
  });

  useEffect(() => {
    if (isSuccess) {
      setTicket(data);
    }
    if (isError) {
      alert("Failed to fetch ticket");
    }
  }, [data, isError, isSuccess, ticketId]);
  return { ticket, isLoading, isError };
}

export function CheckInPage() {
  const { ticket, isError, isLoading } = useGetTicketByQuery();

  function handleConfirm() {
    window.location.href = "/checkin/select-seat?ticketId=" + ticket?.id;
  }
  return (
    <>
      <h1 className="text-2xl font-semibold my-3 text-center">Check-in</h1>
      <div className="rounded-lg p-4 shadow-sm shadow-indigo-300 mt-1 border-indigo-100 border lg:max-w-2xl mx-auto">
        <h3 className="text-xl font-semibold mb-4">Ticket Detail</h3>
        {isLoading && <SimpleLoadingScreen />}
        {!isLoading && isError && (
          <div className="text-center">Failed to fetch ticket</div>
        )}

        {!isLoading && !isError && (
          <>
            <div className="flex gap-4 mt-2 mb-4">
              <div>
                <span className="text-gray-500">Status: </span>
                <span className=" font-semibold text-green-700">
                  {ticket?.status}
                </span>
              </div>
            </div>
            <h4 className="font-semibold text-base">Passenger information</h4>

            <div className="flex gap-4 mt-2 mb-4">
              <div className="text-base">
                <span className="text-gray-500">Name: </span>
                <span className="font-medium">{ticket?.ownerName}</span>
              </div>
              <div>
                <span className="text-gray-500">Date of birth: </span>
                <span className="font-medium">{ticket?.ownerDateOfBirth}</span>
              </div>
            </div>

            <h4 className="font-semibold text-base">Flight information</h4>

            <div className="flex gap-4 mt-2">
              <div>
                <span className="text-gray-500">Flight Code: </span>
                <span className="font-medium">{ticket?.flightCode}</span>
              </div>
              <div>
                <span className="text-gray-500">Airline: </span>
                <span className="font-medium">Vietnam Airline</span>
              </div>
              <div>
                <span className="text-gray-500">Flight class: </span>
                <span className="font-medium">{ticket?.flightClass}</span>
              </div>
            </div>
          </>
        )}
      </div>

      <button
        disabled={isLoading || isError}
        onClick={handleConfirm}
        className="block mx-auto w-full my-8 rounded-lg bg-blue-500 px-4 py-2 font-medium text-white sm:w-auto"
      >
        Confirm and proceed
      </button>
    </>
  );
}

export function SelectSeatPage() {
  const { ticket, isLoading: isTicketLoading } = useGetTicketByQuery();
  const [seats, setSeats] = useState<FlightSeat[]>();
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [selectedSeat, setSelectedSeat] = useState<FlightSeat | null>(null);

  const { data, isSuccess, isError, isLoading } = useQuery({
    queryKey: ["flightSeats"],
    queryFn: async () => {
      if (!ticket) {
        return;
      }
      return await getFlightSeats(ticket.flightCode);
    },
    enabled: !!ticket,
    retry: false,
  });
  useEffect(() => {
    if (isSuccess) {
      setSeats(data);
    }
    if (isError) {
      alert("Failed to fetch seats");
    }
  }, [data, isError, isSuccess, ticket]);

  function handleSeatClick(seat: FlightSeat) {
    if (seat.available) {
      setIsConfirmModalOpen(true);
      setSelectedSeat(seat);
    }
  }

  async function handleCheckInButton() {
    if (!ticket || !selectedSeat) {
      return;
    }
    try {
      await checkIn({
        ticketId: ticket.id,
        seatCode: selectedSeat?.seatCode,
      });
      alert("Check-in successful");
      window.location.href = "/dashboard";
      return;
    } catch {
      alert(
        "Failed to check-in! Make sure to select seat matching your ticket class"
      );
    }
  }
  return (
    <>
      <Modal isOpen={isConfirmModalOpen}>
        <div className="p-4">
          <h3 className="text-lg font-semibold mb-4">Confirm Check-in</h3>
          <div className="flex gap-4 mt-2 mb-4">
            <div>
              <span className="text-gray-500">Seat: </span>
              <span className=" font-semibold text-green-700">
                {selectedSeat?.seatCode}
              </span>
              <br />
              <div className="text-gray-500 mt-4">
                Reminder: You might be unable to change seat after this action
              </div>
            </div>
          </div>
          <button
            onClick={async () => {
              await handleCheckInButton();
            }}
            className="block mx-auto w-full my-8 rounded-lg bg-blue-500 px-4 py-2 font-medium text-white sm:w-auto"
          >
            Confirm
          </button>
        </div>
        <button
          onClick={() => setIsConfirmModalOpen(false)}
          className="absolute bottom-5 right-5 bg-black text-white px-4 py-2 rounded-lg"
        >
          Close
        </button>
      </Modal>

      <h1 className="text-2xl font-semibold my-3 text-center mb-10">
        Select Seat
      </h1>
      <div className="flex flex-col mx-auto w-32 justify-center items-center my-5 gap-y-4">
        <div className="flex items-center gap-x-4">
          <div className="border border-black inline-block size-5 bg-gray-100"></div>
          <span className="text-gray-500">Available </span>
        </div>
        <div className="flex items-center gap-x-4">
          <div className="border border-black inline-block size-5 bg-red-300"></div>
          <span className="">Occupied </span>
        </div>
      </div>
      {(isLoading || isTicketLoading) && <SimpleLoadingScreen />}

      {!isLoading && seats && (
        <div className="flex justify-center items-center flex-wrap gap-12 p-4 lg:w-5/12 mx-auto">
          {seats.map((seat) => (
            <SeatComponent
              disable={seat.flightClass !== ticket?.flightClass}
              seat={seat}
              onClick={handleSeatClick}
            />
          ))}
        </div>
      )}
    </>
  );
}

function SeatComponent({
  seat,
  onClick,
  disable = false,
}: {
  seat: FlightSeat;
  onClick?: (seat: FlightSeat) => void;
  disable: boolean;
}) {
  return (
    <button
      disabled={disable}
      onClick={() => onClick?.(seat)}
      key={seat.id}
      className={` border py-3 border-b-indigo-400 rounded-lg shadow-sm w-32 hover:shadow-lg hover:shadow-blue-100 ${
        seat.available ? "bg-gray-100" : "bg-red-100"
      } ${disable ? "opacity-50" : ""}`}
    >
      <div className="text-center">
        <span className="text-lg font-semibold">{seat.seatCode}</span>
      </div>
      <div className="text-center">
        <span className="text-base">{seat.flightClass}</span>
      </div>
      <div className="text-center">
        <span className="text-base">
          {seat.available ? "Available" : "Occupied"}
        </span>
      </div>
    </button>
  );
}
