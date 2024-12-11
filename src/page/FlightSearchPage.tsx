import { FormEvent, useEffect, useRef, useState } from "react";
import {
  getAllLocation,
  Location,
  searchLocationByName,
} from "../api/LocationAPI";

export function FlightSearchPage() {
  const [locations, setLocations] = useState<Location[]>([]);

  const [selectedFrom, setSelectedFrom] = useState<number | null>(null);

  const [selectedTo, setSelectedTo] = useState<number | null>(null);

  // const [flights] = useState<Flights[]>([]);

  useEffect(() => {
    async function fetchLocations() {
      try {
        const locationsRes = await getAllLocation();
        setLocations(locationsRes ? locationsRes : []);
      } catch {
        console.log("Failed to fetch locations");
      }
    }
    fetchLocations();
  }, []);

  async function searchFlightsButtonHandler() {
    try {
      if (!selectedFrom || !selectedTo) {
        alert("Please select departure and destination location");
        return;
      }
      document.location.href = `/flights/search/result?from=${selectedFrom}&to=${selectedTo}`;
    } catch (e) {
      console.log("Failed to search flights" + e);
    }
  }

  return (
    <div className="flex flex-col items-center pt-36 h-screen w-full bg-gray-100">
      <h1 className="text-4xl font-bold mb-4">Search for Flights</h1>
      <p className="text-lg text-gray-600 mb-8">Book your flights with ease</p>
      <div className="flex flex-row gap-6">
        <SelectBox
          onChange={(id) => setSelectedFrom(id)}
          title="Departure location"
          locations={locations}
        />
        <SelectBox
          onChange={(id) => setSelectedTo(id)}
          title="Destination"
          locations={locations}
        />
      </div>
      <button
        onClick={async () => await searchFlightsButtonHandler()}
        className="mt-10 px-6 py-3 bg-blue-500 text-white rounded-md shadow-md hover:bg-blue-600"
      >
        Search
      </button>
      {/* 
      <p className="text-lg text-gray-600 my-4">
        {flights.length} flights found
      </p> */}
    </div>
  );
}

function SelectBox(props: {
  title: string;
  locations: Location[];
  onChange?: (id: number | null) => void;
}) {
  const dropdownRef = useRef<HTMLUListElement>(null);
  const [searchResultsOpen, setSearchResultsOpen] = useState(false);
  const [searchResults, setSearchResults] = useState<Location[]>([]);
  const [selectedLocationName, setSelectedLocationName] = useState<string>("");
  const { title, onChange } = props;

  async function onInputChange(e: FormEvent<HTMLInputElement>) {
    const value = (e.target as HTMLInputElement).value;
    setSelectedLocationName(value);
    if (onChange) onChange(null);
    if (value.length > 0) {
      try {
        const location = await searchLocationByName(value);
        setSearchResults(location);
        setSearchResultsOpen(true);
      } catch (e) {
        console.log("Failed to search location" + e);
      }
    } else {
      setSearchResultsOpen(false);
    }
  }

  const handleClickOutside = (event: MouseEvent) => {
    if (
      (dropdownRef.current as HTMLElement) &&
      !(dropdownRef.current as HTMLElement).contains(event.target as Node)
    ) {
      setSearchResultsOpen(false);
    }
  };
  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div>
      <label
        htmlFor="HeadlineAct"
        className="block text-sm font-medium text-gray-900"
      >
        {" "}
        {title}{" "}
      </label>

      <input
        onInput={onInputChange}
        value={selectedLocationName}
        className="mt-1.5 w-full rounded-lg border-gray-300 text-gray-700 sm:text-sm"
        type="text"
        placeholder="Location"
      />

      {searchResultsOpen && (
        <ul
          ref={dropdownRef}
          className="space-y-1 bg-white p-2 absolute rounded-md min-w-64"
        >
          {searchResults.length > 0 ? (
            searchResults.map((location) => {
              return (
                <li key={location.id} value={location.id}>
                  <button
                    onClick={() => {
                      if (onChange) onChange(location.id);
                      setSearchResultsOpen(false);
                      setSelectedLocationName(location.locationName);
                    }}
                    className="block hover:bg-gray-200 rounded-lg w-full text-start px-4 py-2 text-sm font-medium text-gray-700"
                  >
                    {location.locationName}
                  </button>
                </li>
              );
            })
          ) : (
            <div className="block px-4 py-2 text-sm  text-gray-700">
              No results found
            </div>
          )}
        </ul>
      )}
    </div>
  );
}
