import { LOGIN_ROUTE } from "../../constant/CommonRoutes";
import { useCsrf } from "../../hooks/useCsrf";
import { refreshToken } from "../auth/AuthenticationAPI";

async function fetchWithAuth(
  url: string,
  options: RequestInit = {}
): Promise<Response> {
  const fetchOptions: RequestInit = {
    ...options,
    credentials: "include",
  };

  const response = await fetch(url, { ...fetchOptions });

  //Handle 401 Unauthorized by refreshing token
  if (response.status === 401) {
    // Access token is expired, try to refresh it
    try {
      const refreshRes = await refreshToken({
        refreshToken: localStorage.getItem("refreshToken") || "",
        deviceId: "web",
      });
      localStorage.setItem("accessToken", refreshRes.accessToken);
      localStorage.setItem("refreshToken", refreshRes.refreshToken);
    } catch {
      //Redirect to login page if refresh token fails
      handleUnauthorizedRequest();
      return response;
    }

    // Retry the original request
    return fetch(url, { ...fetchOptions });
  }

  return response;
}

function handleUnauthorizedRequest() {
  if (document.location.pathname !== LOGIN_ROUTE) {
    document.location.href = LOGIN_ROUTE;
  }
}

export { fetchWithAuth };

export function useCsrfFetch() {
  const tokenData = useCsrf();

  return async (url: string, options: RequestInit) => {
    const headers: HeadersInit = options.headers || {};
    if (
      !options.method ||
      ["POST", "PUT", "DELETE", "PATCH"].includes(options.method.toUpperCase())
    ) {
      if (!tokenData) {
        throw new Error("CSRF token is not available");
      }

      (headers as Record<string, string>)[tokenData.headerName] =
        tokenData.token;
    }

    const response = await fetch(url, {
      ...options,
      headers: {
        "Content-Type": "application/json",
        ...headers,
      },
      credentials: "include",
    });

    if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
    return response.json();
  };
}
