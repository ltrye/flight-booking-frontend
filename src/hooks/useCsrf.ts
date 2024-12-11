import { useContext } from "react";
import { CsrfContext } from "../context/CsrfContext";

export const useCsrf = () => {
  return useContext(CsrfContext);
};
