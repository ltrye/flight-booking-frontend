import { BACKEND_API_URL } from "../constant/AppConstant";

export interface Location {
  id: number;
  locationName: string;
  locationCode: string;
}

interface LocationResponse {
  code: number;
  data: Location[];
}

export async function getAllLocation() {
  const res = await fetch(`${BACKEND_API_URL}/location/getAll`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });

  const json = (await res.json()) as LocationResponse;
  const locations = json.data as Location[];

  return locations;
}
export async function searchLocationByName(name: string) {
  const url= `${BACKEND_API_URL}/location/search?name=${name}&limit=8`;


  const res = await fetch(url.toString(), {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });

  const json = (await res.json()) as LocationResponse;
  const locations = json.data as Location[];

  return locations;
}
