import { ReactNode, useContext } from "react";
import { AuthenticatonContext } from "../../context/AuthenticationContext";
import { FLIGHTS_ROUTE } from "../../constant/CommonRoutes";
import { Footer } from "../../component/Footer";
import { NavigationBar } from "../../component/NavigationBar";

const NavigationItem = [
  { name: "Home", url: "/home" },
  { name: "Flights", url: FLIGHTS_ROUTE },
  { name: "Dashboard", url: "/dashboard" },
  { name: "About us", url: "#" },
];

export function AppLayout({ children }: { children: ReactNode }) {
  const { isAuthenticated, userDetails, isLoading } =
    useContext(AuthenticatonContext);

  return (
    <>
      <NavigationBar
        navigationItems={NavigationItem}
        isAuthenticated={isAuthenticated}
        userDetails={userDetails ?? undefined}
        isLoading={isLoading}
      />
      <main className="min-h-screen">{children}</main>
      <Footer />
    </>
  );
}
