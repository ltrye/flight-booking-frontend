import { useEffect, useState } from "react";
import { getMe, User } from "../api/UserAPI";
import { useQuery, useQueryClient } from "@tanstack/react-query";

export function useAuth() {
  const client = useQueryClient();
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [userDetails, setUserDetails] = useState<User | null>(null);

  const { data, isLoading, isError, isSuccess } = useQuery({
    queryKey: ["me"],
    queryFn: async () => {
      return await getMe();
    },
    refetchOnWindowFocus: false,
    retry: false,
  });
  function invalidateContext() {
    client.invalidateQueries({
      queryKey: ["me"],
    });
  }
  useEffect(() => {
    if (isError) {
      setIsAuthenticated(false);
      setUserDetails(null);
    }
    if (isSuccess) {
      setIsAuthenticated(true);
      setUserDetails(data!);
    }
  }, [data, isError, isSuccess]);

  return { isAuthenticated, userDetails, isLoading, invalidateContext };
}
