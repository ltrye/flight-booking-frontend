import { useNavigate } from "react-router";
import { useContext, useEffect } from "react";
import { AuthenticatonContext } from "../context/AuthenticationContext";

export function useRedirectIfAuthenticated(navigateTo: string) {
  const authContext = useContext(AuthenticatonContext);

  const navigate = useNavigate();

  useEffect(() => {
    if (authContext.isAuthenticated) {
      navigate(navigateTo);
    }
  }, [authContext.isAuthenticated, navigate, navigateTo]);

  return authContext;
}

export function useRedirectIfUnAuthenticated(navigateTo: string = "/login") {
  const { isAuthenticated, isLoading } = useContext(AuthenticatonContext);

  const navigate = useNavigate();

  useEffect(() => {
    if (!isLoading && isAuthenticated === false) {
      navigate(navigateTo);
    }
  }, [isAuthenticated, isLoading, navigate, navigateTo]);

  return { isAuthenticated, isLoading };
}
