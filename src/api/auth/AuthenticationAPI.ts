import { AUTH_SERVER_API_URL } from "../../constant/AppConstant";
import { ApiResponse } from "../../domain/CommonDomain";
import { axiosInstance } from "../axios/axiosInstance";

export interface SignupRequest {
  email: string;
  phoneNumber: string;
  firstName: string;
  password: string;
  confirmPassword: string;
}
export interface SignupResponse {
  message: string;
  success: boolean;
}
export async function Signup(
  SignupRequest: SignupRequest
): Promise<SignupResponse> {
  const res = await fetch(`${AUTH_SERVER_API_URL}/signup`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(SignupRequest),
  });

  const json = (await res.json()) as SignupResponse;
  if (!res.ok) {
    throw new Error(json.message);
  }
  return json;
}

export interface LoginRequest {
  email: string;
  password: string;
  requestDeviceInfo: {
    deviceId: string;
  };
}

export interface JwtResponse {
  jwtResponse: {
    accessToken: string;
    refreshToken: string;
    expiresIn: string;
  };
}

export async function Login(request: LoginRequest): Promise<JwtResponse> {
  const res = await axiosInstance.post(
    `${AUTH_SERVER_API_URL}/login`,
    JSON.stringify(request)
  );
  const json = res.data;
  if (res.status !== 200) {
    throw new Error(json.message);
  }

  const jwtData = (json as ApiResponse<JwtResponse>).data.jwtResponse;

  window.localStorage.setItem("accessToken", jwtData.accessToken);
  window.localStorage.setItem("refreshToken", jwtData.refreshToken);

  return json.data;
}

export async function IsAuthenticated(): Promise<boolean> {
  console.log("IsAuthenticated");
  const res = await fetch(`${AUTH_SERVER_API_URL}/user/me`, {
    method: "GET",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!res.ok) {
    return false;
  }
  return true;
}

interface refreshTokenResponse {
  accessToken: string;
  refreshToken: string;
  expiresIn: string;
}

export interface RefreshTokenRequest {
  refreshToken: string;
  deviceId: string;
}

export async function refreshToken(
  refreshTokenRequest: RefreshTokenRequest
): Promise<refreshTokenResponse> {
  const res = await axiosInstance.post(
    `${AUTH_SERVER_API_URL}/refresh-token`,
    JSON.stringify(refreshTokenRequest)
  );
  if (res.status !== 200) {
    throw new Error("Failed to refresh token");
  }
  const resJson = res.data as ApiResponse<refreshTokenResponse>;
  return resJson.data;
}
