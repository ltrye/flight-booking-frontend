export const BACKEND_URL = import.meta.env.VITE_BACKEND_URL as string;
export const BACKEND_API_URL = (import.meta.env.VITE_BACKEND_URL +
  "/api") as string;

export const AUTH_SERVER_URL = import.meta.env.VITE_AUTH_SERVER_URL as string;
export const AUTH_SERVER_API_URL = (import.meta.env.VITE_AUTH_SERVER_URL +
  "/api") as string;

export const APP_URL = import.meta.env.VITE_APP_URL as string;
  
export const bookingStatusCode = {
  PENDING: 1,
  BOOKED: 2,
  CHECKED_IN: 3,
  CANCELED: 0,
};

