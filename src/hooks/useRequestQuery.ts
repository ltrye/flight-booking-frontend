import React from "react";
import { useLocation } from "react-router";

export function useRequestQuery() {
  const { search } = useLocation();

  return React.useMemo(() => new URLSearchParams(search), [search]);
}

export function useGetRequestQuery(...keys: string[]) {
  const { search } = useLocation();

  const params = new URLSearchParams(search);
  return keys.reduce((acc, key) => {
    return {
      ...acc,
      [key]: params.get(key),
    };
  }, {});
}
