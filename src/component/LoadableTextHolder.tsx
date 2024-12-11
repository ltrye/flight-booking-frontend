import { ReactNode } from "react";

export function LoadableTextHolder({
  className,
  children,
  isLoading,
}: {
  className?: string;
  children: ReactNode;
  isLoading: boolean;
}) {
  return (
    <>
      {isLoading && <div className={` animate-pulse ${className}`}></div>}
      {!isLoading && children}
    </>
  );
}
