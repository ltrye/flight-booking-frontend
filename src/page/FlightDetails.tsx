import React from "react";
import { useParams } from "react-router-dom";
import { Flights, getById } from "../api/FlightAPI";
import { getFormattedDate } from "../utils/CommonUtils";
import { useQuery } from "@tanstack/react-query";
import { SimpleLoadingScreen } from "../component/SimpleLoading";

export function FlightDetailsPage() {
  const flightId = useParams().flightId;

  const { data: flight, isLoading } = useQuery({
    queryKey: ["flight", { flightId }],
    queryFn: async () => await getById(parseInt(flightId ?? "")),
  });

  return (
    <div className="bg-white lg:w-2/4 max-w-5xl shadow overflow-hidden sm:rounded-lg mx-auto md:mt-20 mb-20">
      <div className="px-4 py-5 sm:px-6">
        <h3 className="text-lg leading-6 font-medium text-gray-900">
          Flight details
        </h3>
      </div>
      {isLoading && <SimpleLoadingScreen />}
      {!isLoading && flight && (
        <>
          <FlightDetailsTable flight={flight} />
          <a href={`/book/${flight.id}`}>
            <button className="bg-blue-500 hover:bg-blue-700 w-full text-white font-bold py-2 px-4 rounded transition-colors">
              Book now
            </button>
          </a>
        </>
      )}
      {!isLoading && !flight && (
        <div className="px-4 py-5 sm:px-6">
          <h3 className="text-lg leading-6 font-medium text-gray-900">
            Flight not found
          </h3>
        </div>
      )}
    </div>
  );
}

export function FlightDetailsTable({ flight }: { flight: Flights }) {
  return (
    <div className="border-t border-gray-200">
      <dl>
        <DetailRow keyValue="Flight Code" value={flight.flightCode} />
        <DetailRow keyValue="Airline" value={flight.airlineName} />
        <DetailRow
          keyValue="Destination"
          value={flight.destination.locationName}
        />
        <DetailRow
          keyValue="Depart location"
          value={flight.departureLocation.locationName}
        />
        <DetailRow
          keyValue="Departure airport"
          value={flight.departureAirport.name}
        />
        <DetailRow
          keyValue="Destination airport"
          value={flight.destinationAirport.name}
        />
        <DetailRow
          keyValue="Depart date"
          value={getFormattedDate(flight.departDate)}
        />
        <DetailRow
          keyValue="Arrived date"
          value={getFormattedDate(flight.estimatedArrivedDate)}
        />
        <DetailRow keyValue="Flight classes available">
          <ul className="border border-gray-200 rounded-md divide-y divide-gray-200">
            {flight.flightClassDetails.map((fare) => (
              <>
                <li key={fare.flightClass}>
                  <div className="flex items-center justify-between bg-gray-50 px-4 py-4 sm:px-6">
                    <div className="flex flex-col">
                      <div className="text-sm font-medium text-gray-900">
                        {fare.flightClass}
                      </div>
                      <div className="text-sm text-gray-500">
                        Fare: {fare.fare}
                      </div>
                    </div>
                  </div>
                </li>
              </>
            ))}
          </ul>
        </DetailRow>
      </dl>
    </div>
  );
}

function DetailRow({
  keyValue: key,
  value,
  children,
}: {
  keyValue: string;
  value?: string;
  children?: React.ReactNode;
}) {
  return (
    <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
      <dt className="text-sm font-medium text-gray-500">{key}</dt>
      <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
        {value}
        {children}
      </dd>
    </div>
  );
}
