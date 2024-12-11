import { createContext } from "react";
import { User } from "../api/UserAPI";
import { useAuth } from "../hooks/useAuthentication";

export interface AuthContext {
  userDetails: User | null;
  isAuthenticated: boolean | null;
  isLoading: boolean;
  invalidateContext: () => void;
}

export const AuthenticatonContext = createContext<AuthContext>({
  userDetails: null,
  isAuthenticated: null,
  isLoading: false,
  invalidateContext: () => {},
});

export function AuthenticationContextProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const { userDetails, isAuthenticated, invalidateContext, isLoading } =
    useAuth();
  return (
    <AuthenticatonContext.Provider
      value={{ userDetails, isAuthenticated, invalidateContext, isLoading }}
    >
      {children}
    </AuthenticatonContext.Provider>
  );
}
