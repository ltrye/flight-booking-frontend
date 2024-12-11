import { Flights, searchFlight } from "../api/FlightAPI";
import { FLIGHTS_DETAILS_ROUTE } from "../constant/CommonRoutes";
import { useEffect, useState } from "react";
import { useRequestQuery } from "../hooks/useRequestQuery";
import { useQuery } from "@tanstack/react-query";
import { SimpleLoadingScreen } from "../component/SimpleLoading";

function useSearchFlights() {
  const query = useRequestQuery();
  const from = query.get("from");
  const to = query.get("to");

  const [flights, setFlights] = useState<Flights[]>([]);

  const { data, isLoading, isSuccess, isError } = useQuery({
    queryKey: ["searchFlight", { sourceId: from, destinationId: to }],
    queryFn: async () => await searchFlights(),
  });

  async function searchFlights() {
    if (!from || !to) {
      alert("Please select departure and destination location");
      return;
    }
    const flights: Flights[] = await searchFlight({
      sourceId: parseInt(from),
      destinationId: parseInt(to),
      date: "",
      class: "Economy",
    });

    return flights;
  }
  useEffect(() => {
    if (isSuccess) {
      setFlights(data!);
    }
    if (isError) {
      alert("Failed to search flights");
      window.location.href = "/flights";
    }
  }, [isSuccess, data, isError]);

  return { flights, isLoading };
}

export function FlightSearchResultPage() {
  const { flights, isLoading } = useSearchFlights();

  function onBackToSearchButtonClick() {
    document.location.href = "/flights";
  }

  return (
    <>
      <button
        className="px-4 py-2 bg-blue-500 ml-5 mt-5 text-white rounded-lg "
        onClick={onBackToSearchButtonClick}
      >
        Back to search
      </button>
      {isLoading && <SimpleLoadingScreen />}
      {!isLoading && (
        <>
          <h1 className="text-xl text-center my-10">
            {flights.length} flights found
          </h1>
          <div className="max-w-xl mx-auto my-10">
            {flights.map((flight) => (
              <FlightListItem key={flight.id} flight={flight} />
            ))}
          </div>
        </>
      )}
    </>
  );
}

function FlightListItem({ flight }: { flight: Flights }) {
  return (
    <a
      href={FLIGHTS_DETAILS_ROUTE + flight.id}
      className="block rounded-lg p-4 shadow-sm shadow-indigo-300 mt-3 border border-indigo-300 "
    >
      <div className="">
        <div className=" flex items-center gap-8 text-sm justify-center">
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

              <p className="font-medium">{flight.flightCode}</p>
            </div>
          </div>

          <div className="sm:inline-flex sm:shrink-0 sm:items-center sm:gap-2">
            <div className="mt-1.5 sm:mt-0">
              <p className="text-gray-500">Airline</p>

              <p className="font-medium">{flight.airlineName}</p>
            </div>
          </div>

          <div className="sm:inline-flex sm:shrink-0 sm:items-center sm:gap-2">
            <div className="mt-1.5 sm:mt-0">
              <p className="text-gray-500">Flight depart date </p>

              <p className="font-medium">
                {new Date(flight.departDate).toLocaleString()}
              </p>
            </div>
          </div>
        </div>
      </div>
    </a>
  );
}
