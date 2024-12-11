import { createContext, useEffect, useState } from "react";
import { CsrfTokenData, getCsrfToken } from "../api/common/CsrfAPI";

export const CsrfContext = createContext<CsrfTokenData | null>(null);
export function CsrfContextProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [csrfToken, setCsrfToken] = useState<CsrfTokenData | null>(null);

  useEffect(() => {
    getCsrfToken().then(setCsrfToken);
  }, []);

  return (
    <CsrfContext.Provider value={csrfToken}>{children}</CsrfContext.Provider>
  );
}
