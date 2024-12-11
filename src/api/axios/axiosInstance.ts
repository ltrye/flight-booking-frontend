import axios from "axios";
import { BACKEND_API_URL } from "../../constant/AppConstant";
import { refreshToken } from "../auth/AuthenticationAPI";
import { CsrfTokenData } from "../common/CsrfAPI";
import { getCookie } from "../../utils/CommonUtils";

const axiosInstance = axios.create({
  baseURL: BACKEND_API_URL,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

axiosInstance.interceptors.request.use(
  (config) => {
    const token = window.localStorage.getItem("accessToken");
    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
      config.headers["credentials"] = "include";
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    if (
      error.response &&
      error.response.status === 401 &&
      !originalRequest._retry
    ) {
      originalRequest._retry = true;
      try {
        const res = await refreshToken({
          refreshToken: localStorage.getItem("refreshToken") || "",
          deviceId: "99886117",
        });
        axios.defaults.headers.common[
          "Authorization"
        ] = `Bearer ${res.accessToken}`;
      } catch (error) {
        //Redirect to login page if refresh token fails
        handleUnauthorizedRequest();
        return Promise.reject(error);
      }
      return axiosInstance(originalRequest);
    }
    return Promise.reject(error);
  }
);

axiosInstance.interceptors.request.use(
  async (config) => {
    // if (!config.method || config.method.toUpperCase() === "GET") return config;
    const csrfToken = getCsrfTokenFromCookie(); // Assume getCsrfToken is a function that fetches the CSRF token
    if (csrfToken) {
      config.headers[csrfToken.headerName] = csrfToken.token;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

function getCsrfTokenFromCookie(): CsrfTokenData | null {
  const csrfToken = getCookie("XSRF-TOKEN");
  if (!csrfToken) {
    return null;
  }
  return {
    headerName: "X-XSRF-TOKEN",
    token: csrfToken,
  };
}

export { axiosInstance };

function handleUnauthorizedRequest() {
  //   if (document.location.pathname !== LOGIN_ROUTE) {
  //     document.location.href = LOGIN_ROUTE;
  //   }
}
