import { AUTH_SERVER_API_URL } from "../constant/AppConstant";
import { axiosInstance } from "./axios/axiosInstance";
import { ErrorResponse } from "./CommonResponse";

const userRoute = "/user";

export interface User {
  id: string;
  email: string;
  phoneNumber: string;
  fullName: string;
  dateOfBirth: string;
}

export async function getMe(): Promise<User> {
  const res = await axiosInstance.get(`${AUTH_SERVER_API_URL}${userRoute}/me`);

  if (res.status !== 200) {
    const errorJson = res.data() as ErrorResponse;
    throw new Error(errorJson.message);
  }
  const json = res.data as User;

  return json;
}

export async function Logout() {
  const res = await axiosInstance.get(`${AUTH_SERVER_API_URL}/logout`);
  if (res.status === 200) {
    window.localStorage.removeItem("accessToken");
    window.localStorage.removeItem("refreshToken");
    document.cookie = "token=; path=/;";
  } else {
    const errorJson = (await res.data) as ErrorResponse;
    throw new Error(errorJson.message);
  }
}
