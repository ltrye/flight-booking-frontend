import { useNavigate } from "react-router";
import { useContext, useEffect} from "react";
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
