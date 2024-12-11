import { useEffect, useState } from "react";
import { useParams } from "react-router";
import { getTicketById, Ticket } from "../api/BookingAPI";
import { useQuery } from "@tanstack/react-query";
import { LoadableTextHolder } from "../component/LoadableTextHolder";

function useFetchTicketData(postFetchAction?: (ticket: Ticket) => void) {
  const { ticketId } = useParams<{ ticketId: string }>();
  const [ticket, setTicket] = useState<Ticket | null>(null);

  const { data, isSuccess, isError, isLoading } = useQuery({
    queryKey: ["ticket", ticketId],
    queryFn: async () => {
      if (!ticketId) {
        return;
      }
      return await getTicketById(ticketId);
    },
    retry: false,
  });
  useEffect(() => {
    if (isSuccess) {
      setTicket(data!);
      postFetchAction?.(data!);
    }
    if (isError) {
      alert("Failed to fetch ticket");
    }
  }, [ticketId, postFetchAction, isSuccess, isError, data]);

  return { ticket, setTicket, isLoading };
}

export function BookSuccessPage() {
  const { ticket, isLoading } = useFetchTicketData();

  return (
    <div className="mx-auto my-10 rounded-lg lg:my-32 lg:max-w-md border border-indigo-300 bg-white p-4 shadow-sm shadow-indigo-300 transition hover:shadow-indigo-200 hover:shadow-lg sm:p-6">
      <h3 className="mt-0.5 text-lg font-medium text-gray-900">
        Booking successful!
      </h3>

      <LoadableTextHolder
        isLoading={isLoading}
        className="mt-2 w-full h-6  bg-gray-200 rounded-lg"
      >
        <p className="mt-2 line-clamp-3 text-sm/relaxed text-gray-500">
          Flight code: {ticket?.flightCode}
        </p>
      </LoadableTextHolder>

      <a
        href="/dashboard"
        className="group mt-4 inline-flex items-center gap-1 text-sm font-medium text-blue-600"
      >
        Go to dashboard
        <span
          aria-hidden="true"
          className="block transition-all group-hover:ms-0.5 rtl:rotate-180"
        >
          &rarr;
        </span>
      </a>
    </div>
  );
}
