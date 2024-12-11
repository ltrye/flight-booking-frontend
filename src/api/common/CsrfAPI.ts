import { BACKEND_URL } from "../../constant/AppConstant";
import { getCookie } from "../../utils/CommonUtils";

export interface CsrfTokenData {
  headerName: string;
  token: string;
}

export async function getCsrfToken() {
  const res = await fetch(`${BACKEND_URL}/csrf`, {
    method: "GET",
    credentials: "include",
  });
  const data = await res.json();
  const csrfToken = getCookie("XSRF-TOKEN");
  if (!csrfToken) {
    throw new Error("CSRF token not found in cookies");
  }
  return {
    headerName: data.headerName,
    token: data.token,
  };
}
