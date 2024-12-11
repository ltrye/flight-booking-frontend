import { useEffect, useReducer, useState } from "react";
import { InputLabelWrapper } from "../component/InputWithLabel";
import { nationList } from "../utils/NationList";
import { bookFlight, BookingResponse, BookRequest } from "../api/BookingAPI";
import { useParams } from "react-router";
import {
  FlightClassDetail,
  Flights,
  getById as getFlightById,
} from "../api/FlightAPI";
import { SelectPayment } from "../component/SelectPayment";
import { SimpleLoading } from "../component/SimpleLoading";
import { useQuery } from "@tanstack/react-query";
import { LoadableTextHolder } from "../component/LoadableTextHolder";

interface BookingDetailChangeAction {
  name: string;
  value: string;
}

type BookingDetailReducerAction = BookingDetailChangeAction | BookRequest;

function useFetchFlightData(postFetchAction?: (flight: Flights) => void) {
  const { flightId } = useParams<{ flightId: string }>();
  const [flight, setFlight] = useState<Flights | null>(null);

  const { data, isLoading, isError, isSuccess } = useQuery({
    queryKey: ["me"],
    queryFn: async () => {
      if (!flightId) {
        return;
      }
      const flight = await getFlightById(parseInt(flightId));
      return flight;
    },
    refetchOnWindowFocus: false,
    retry: false,
  });
  useEffect(() => {
    if (isSuccess) {
      setFlight(data!);
      postFetchAction?.(data!);
    }
  }, [data, flightId, isSuccess, postFetchAction]);

  return { flight, setFlight, isLoading, isError, isSuccess };
}

function bookFlightDataReducer(
  state: BookRequest,
  action: BookingDetailReducerAction
): BookRequest {
  if ("flightId" in action) {
    return action;
  }
  if ("name" in action) {
    return {
      ...state,
      [action.name]: action.value,
    };
  }
  return state;
}

export function BookFlightFillDetailForm() {
  const { flight, isLoading } = useFetchFlightData();

  const [bookingResponse, setBookingResponse] =
    useState<BookingResponse | null>(null);

  useEffect(() => {
    if (flight) {
      setBookingData({
        name: "flightId",
        value: flight.id.toString(),
      });
    }
  }, [flight]);

  const [state, setBookingData] = useReducer(bookFlightDataReducer, {
    flightId: "",
    airplaneClassOptionId: "",
    name: "",
    dob: "",
    email: "",
    phoneNumber: "",
    address: "",
    city: "",
    country: "Vietnam",
    identityCard: "",
  });

  const [selectedFlightClass, setSelectedFlightClass] = useState<
    FlightClassDetail | undefined
  >(undefined);

  async function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) {
    setBookingData({
      name: e.target.name,
      value: e.target.value,
    });
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    try {
      const bookingResponse = await bookFlight(state);
      setBookingResponse(bookingResponse);
      // window.location.href = "/book/success/" + ticketId;
    } catch {
      alert("Failed to book flight");
    }
  }

  function handleFlightClassSelectChange(
    e: React.ChangeEvent<HTMLSelectElement>
  ) {
    const airplaneClassId = e.target.value;

    const selectedClass = flight?.flightClassDetails.find(
      (option) => option.airplaneFlightClassId === parseInt(airplaneClassId)
    );
    setSelectedFlightClass(selectedClass);
    handleChange(e);
  }

  return (
    <section className="bg-gray-100">
      <div className="mx-auto max-w-screen-xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-x-16 gap-y-8 lg:grid-cols-5">
          <div className="lg:col-span-2 lg:py-12">
            <div className="mt-8">
              <a href="#" className="text-2xl font-bold text-blue-500">
                {" "}
                Book flight tickets{" "}
              </a>
            </div>
            <br />

            <p className="max-w-xl text-lg my-2">
              Flight code:{" "}
              <LoadableTextHolder
                isLoading={isLoading}
                className="h-5 w-24 inline-block bg-blue-200 rounded-lg"
              >
                <span className="text-lg font-bold text-blue-500">
                  {" "}
                  {flight?.flightCode}
                </span>
              </LoadableTextHolder>
            </p>
            <p className="max-w-xl text-lg my-2">
              Departure:{" "}
              <LoadableTextHolder
                isLoading={isLoading}
                className="h-5 w-24 inline-block bg-blue-200 rounded-lg"
              >
                <span className="font-semibold">
                  {flight?.departureLocation.locationName}
                </span>
              </LoadableTextHolder>
            </p>
            <p className="max-w-xl text-lg my-2">
              Destination:{" "}
              <LoadableTextHolder
                isLoading={isLoading}
                className="h-5 w-24 inline-block bg-blue-200 rounded-lg"
              >
                <span className="font-semibold">
                  {flight?.destination.locationName}
                </span>
              </LoadableTextHolder>
            </p>

            <hr className="my-4 border-gray-400" />
            <p className="max-w-xl text-base">
              Please provide infomation by filling in the form.
            </p>
          </div>

          {bookingResponse ? (
            <SelectPayment bookingId={bookingResponse.ticketId} />
          ) : (
            <BookingForm
              flight={flight}
              handleChange={handleChange}
              handleSubmit={handleSubmit}
              handleFlightClassSelectChange={handleFlightClassSelectChange}
              selectedFlightClass={selectedFlightClass}
            />
          )}
        </div>
      </div>
    </section>
  );
}

function BookingForm({
  flight,
  handleChange,
  handleSubmit,
  handleFlightClassSelectChange,
  selectedFlightClass,
}: {
  flight: Flights | null;
  handleChange: (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => void;
  handleSubmit: (e: React.FormEvent<HTMLFormElement>) => Promise<void>;
  handleFlightClassSelectChange: (
    e: React.ChangeEvent<HTMLSelectElement>
  ) => void;
  selectedFlightClass: FlightClassDetail | undefined;
}) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  return (
    <div className="rounded-lg bg-white p-8 shadow-lg lg:col-span-3 lg:p-12">
      <form
        onSubmit={async (e) => {
          setIsSubmitting(true);
          await handleSubmit(e);
          setIsSubmitting(false);
        }}
        className="space-y-4"
      >
        <div className="space-y-4">
          <h2 className="text-xl font-semibold">Personal infomation</h2>
          <div>
            <InputLabelWrapper htmlFor="name" label="Name" hideLabel>
              <input
                required
                onChange={(e) => handleChange(e)}
                className="w-full rounded-lg border-gray-200 p-3 text-sm"
                placeholder="Name"
                type="text"
                name="name"
                id="name"
              />
            </InputLabelWrapper>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <InputLabelWrapper htmlFor="dob" label="Date of birth">
                <input
                  required
                  onChange={(e) => handleChange(e)}
                  name="dob"
                  className="w-full rounded-lg border-gray-200 p-3 text-sm"
                  placeholder="Date of birth"
                  type="date"
                  id="dob"
                />
              </InputLabelWrapper>
            </div>

            <div>
              <InputLabelWrapper htmlFor="nation" label="Nationality">
                <select
                  required
                  onChange={(e) => handleChange(e)}
                  name="country"
                  className="mt-1.5 w-full rounded-lg border-gray-300 text-gray-700 sm:text-sm"
                >
                  {nationList.map((nation) => (
                    <option selected={nation === "Vietnam"} value={nation}>
                      {nation}
                    </option>
                  ))}
                </select>
              </InputLabelWrapper>
            </div>
          </div>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <InputLabelWrapper htmlFor="email" label="Email" hideLabel>
                <input
                  required
                  onChange={(e) => handleChange(e)}
                  name="email"
                  className="w-full rounded-lg border-gray-200 p-3 text-sm"
                  placeholder="Email address"
                  type="email"
                  id="email"
                />
              </InputLabelWrapper>
            </div>

            <div>
              <InputLabelWrapper htmlFor="phone" label="Phone" hideLabel>
                <input
                  required
                  onChange={(e) => handleChange(e)}
                  name="phoneNumber"
                  className="w-full rounded-lg border-gray-200 p-3 text-sm"
                  placeholder="Phone Number"
                  type="tel"
                  id="phone"
                />
              </InputLabelWrapper>
            </div>
          </div>
          <div>
            <InputLabelWrapper hideLabel label="Personal Identity" htmlFor="id">
              <input
                required
                onChange={(e) => handleChange(e)}
                name="identityCard"
                className="w-full rounded-lg border-gray-200 p-3 text-sm"
                placeholder="Personal Identity"
                type="text"
                id="id"
              />
            </InputLabelWrapper>
          </div>
        </div>

        <div className="space-y-4">
          <h2 className="text-xl font-semibold">Booking infomation</h2>

          <InputLabelWrapper htmlFor="flightClass" label="Flight class">
            <select
              required
              name="airplaneClassOptionId"
              onChange={handleFlightClassSelectChange}
              className="mt-1.5 w-full rounded-lg border-gray-300 text-gray-700 sm:text-sm"
            >
              <option selected disabled>
                --select--
              </option>
              {flight?.flightClassDetails.map((option) => (
                <option
                  disabled={option.availableSeatCount === 0}
                  value={option.airplaneFlightClassId}
                >
                  {option.flightClass}{" "}
                  {option.availableSeatCount === 0 && "(No seat available)"}
                </option>
              ))}
            </select>
          </InputLabelWrapper>
        </div>

        {/* Total price */}
        <div className="text-lg font-bold text-blue-500">
          {selectedFlightClass ? (
            <>
              <p>
                Available seat: {selectedFlightClass.availableSeatCount} seats
              </p>
              <p>
                Total price: {selectedFlightClass.fare.toLocaleString()} vnd
              </p>
            </>
          ) : (
            <p>Please select flight class to see total price</p>
          )}
        </div>

        <div className="mt-4 flex flex-row gap-6">
          <button
            disabled={!selectedFlightClass || isSubmitting}
            type="submit"
            className="inline-block w-full rounded-lg bg-black px-5 py-3 font-medium text-white sm:w-auto"
          >
            Next
          </button>
          <div>{isSubmitting && <SimpleLoading />}</div>
        </div>
      </form>
    </div>
  );
}
