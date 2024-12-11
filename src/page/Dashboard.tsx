import { useEffect, useState } from "react";
import { cancelTicket, Ticket } from "../api/BookingAPI";

import { getMyTickets } from "../api/UserTicketAPI";
import { Modal } from "../component/Modal";
import { bookingStatusCode } from "../constant/AppConstant";

const statusColor: Record<number, string> = {
  [bookingStatusCode.PENDING]: "text-gray-500",
  [bookingStatusCode.BOOKED]: "text-green-600",
  [bookingStatusCode.CHECKED_IN]: "text-blue-500",
  [bookingStatusCode.CANCELED]: "text-red-500",
};

function getStatusColor(statusCode: number) {
  return statusColor[statusCode] || "text-gray-500";
}

export function UserDashboardPage() {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [displayTickets, setDisplayTickets] = useState<Ticket[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  async function fetchTickets() {
    try {
      const ticketsRes = await getMyTickets();
      setTickets(ticketsRes);
      setDisplayTickets(ticketsRes);
      setIsLoading(false);
    } catch (e) {
      console.log(e);
      alert("Failed to fetch tickets");
    }
  }
  useEffect(() => {
    fetchTickets();
  }, []);

  function filterChangeHandler(event: React.ChangeEvent<HTMLSelectElement>) {
    const filterCode = parseInt(event.target.value);
    const filter: number | "all" = !Number.isNaN(filterCode)
      ? filterCode
      : "all";

    let filteredTickets = tickets;
    if (filter !== "all") {
      filteredTickets = tickets.filter(
        (ticket) => ticket.statusCode === filter
      );
    }

    setDisplayTickets(filteredTickets);
  }

  async function cancelBookingHandler(ticketId: string) {
    const userConfirmed = confirm(
      "Are you sure you want to cancel this ticket?"
    );
    if (!userConfirmed) {
      return;
    }
    try {
      await cancelTicket(ticketId);
    } catch {
      alert("Failed to cancel ticket");
      return;
    }
    alert("Cancel ticket successfully");
    await fetchTickets();
  }
  return (
    <>
      <h1 className="text-2xl font-bold my-4 text-center">Dashboard</h1>
      <h2 className="text-xl mt-5 text-center">My Tickets</h2>
      <div>
        <div className="flex justify-center items-center mt-5 gap-x-5">
          <span className="text-gray-500">Filter </span>
          <select
            onChange={filterChangeHandler}
            className="px-4 pr-10 pl-2 border border-gray-300 rounded-lg"
          >
            <option value="all">All</option>
            <option value={bookingStatusCode.PENDING}>Pending</option>
            <option value={bookingStatusCode.BOOKED}>Booked</option>
            <option value={bookingStatusCode.CHECKED_IN}>Checked-in</option>
            <option value={bookingStatusCode.CANCELED}>Canceled</option>
          </select>
        </div>
      </div>

      {isLoading ? (
        <LoadingScreen />
      ) : (
        <div className="my-10 mx-auto max-w-4xl">
          {displayTickets.map((ticket) => (
            <TicketItem
              onBookingCancel={cancelBookingHandler}
              key={ticket.id}
              ticket={ticket}
            />
          ))}
        </div>
      )}
    </>
  );
}

function TicketItem({
  ticket,
  onBookingCancel,
}: {
  ticket: Ticket;
  onBookingCancel: (ticketId: string) => void;
}) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  return (
    <>
      <Modal isOpen={isModalOpen}>
        <div className="pb-10">
          <h3 className="text-xl font-bold mb-8">Ticket Detail</h3>
          <div className="flex gap-4 mt-2 mb-4">
            <div>
              <span className="text-gray-500">Status: </span>
              <span
                className={`font-semibold ${getStatusColor(ticket.statusCode)}`}
              >
                {ticket.status}
              </span>
            </div>
          </div>
          <h4 className="font-semibold text-base">Passenger information</h4>

          <div className="flex gap-4 mt-2 mb-4">
            <div className="text-base">
              <span className="text-gray-500">Name: </span>
              <span className="font-medium">{ticket.ownerName}</span>
            </div>
            <div>
              <span className="text-gray-500">Date of birth: </span>
              <span className="font-medium">{ticket.ownerDateOfBirth}</span>
            </div>
          </div>

          <h4 className="font-semibold text-base">Flight information</h4>

          <div className="flex gap-4 mt-2">
            <div>
              <span className="text-gray-500">Flight Code: </span>
              <span className="font-medium">{ticket.flightCode}</span>
            </div>
            <div>
              <span className="text-gray-500">Airline: </span>
              <span className="font-medium">Vietnam Airline</span>
            </div>
          </div>

          {ticket.statusCode === bookingStatusCode.BOOKED && (
            <a href={`/checkin?ticketId=${ticket.id}`}>
              <button className="rounded-lg bg-blue-500 px-4 py-2 mt-6 text-white mr-5">
                Checkin now
              </button>
            </a>
          )}

          {(ticket.statusCode === bookingStatusCode.BOOKED ||
            ticket.statusCode === bookingStatusCode.CHECKED_IN) && (
            <button
              onClick={() => onBookingCancel(ticket.id.toString())}
              className="rounded-lg bg-red-500 px-4 py-2 mt-6 text-white"
            >
              Cancel ticket
            </button>
          )}
        </div>
        <button
          className="inline-block w-full rounded-lg bg-black px-4 py-2 font-medium text-white sm:w-auto absolute bottom-5 right-5"
          onClick={() => setIsModalOpen(false)}
        >
          Close
        </button>
      </Modal>
      <button
        onClick={() => setIsModalOpen(true)}
        className="block rounded-lg p-4 shadow-sm shadow-indigo-300 mt-3 border-indigo-100 border lg:w-full"
      >
        <div className=" flex items-center justify-center gap-14 text-sm">
          <div className="sm:inline-flex sm:shrink-0 sm:items-center sm:gap-2">
            <svg
              className="size-4 text-indigo-700"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M8 14v3m4-3v3m4-3v3M3 21h18M3 10h18M3 7l9-4 9 4M4 10h16v11H4V10z"
              />
            </svg>

            <div className="mt-1.5 sm:mt-0">
              <p className="text-gray-500">Flight Code</p>

              <p className="font-medium">{ticket.flightCode}</p>
            </div>
          </div>

          <div className="sm:inline-flex sm:shrink-0 sm:items-center sm:gap-2">
            <div className="mt-1.5 sm:mt-0">
              <p className="text-gray-500">Airline</p>

              <p className="font-medium">{ticket.airlineName}</p>
            </div>
          </div>

          <div className="sm:inline-flex sm:shrink-0 sm:items-center sm:gap-2">
            <div className="mt-1.5 sm:mt-0">
              <p className="text-gray-500">Flight depart date </p>

              <p className="font-medium">
                {new Date(ticket.flightDate).toLocaleString()}
              </p>
            </div>
          </div>

          <div className="sm:inline-flex sm:shrink-0 sm:items-center sm:gap-2">
            <div className="mt-1.5 sm:mt-0">
              <p className="text-gray-500">Booked date </p>

              <p className="font-medium">
                {new Date(ticket.bookedDate).toLocaleString()}
              </p>
            </div>
          </div>

          <div className="sm:inline-flex sm:shrink-0 sm:items-center sm:gap-2">
            <div className="mt-1.5 sm:mt-0">
              <p className="text-gray-500">Status </p>

              <p className={`font-medium ${getStatusColor(ticket.statusCode)}`}>
                {ticket.status}
              </p>
            </div>
          </div>
        </div>
      </button>
    </>
  );
}

function LoadingScreen() {
  return (
    <div className="flex items-center justify-center h-screen">
      <div className="animate-spin rounded-full h-32 w-32 border-t-4 border-b-4 border-blue-400"></div>
    </div>
  );
}
