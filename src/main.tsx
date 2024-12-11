import { createRoot } from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import "./index.css";
import { HomePage } from "./page/HomePage.tsx";
import { FlightSearchPage } from "./page/FlightSearchPage.tsx";
import { LoginPage } from "./page/Login.tsx";
import { SignupPage } from "./page/Signup.tsx";
import { ProfilePage } from "./page/ProfilePage.tsx";
import { AuthenticationContextProvider } from "./context/AuthenticationContext.tsx";
import { AppLayout } from "./page/Layout/AppLayout.tsx";
import { FLIGHTS_ROUTE } from "./constant/CommonRoutes.ts";
import { FlightDetailsPage } from "./page/FlightDetails.tsx";
import { BookFlightFillDetailForm } from "./page/BookFlightFillDetailForm.tsx";
import { BookSuccessPage } from "./page/BookSuccessPage.tsx";
import { UserDashboardPage } from "./page/Dashboard.tsx";
import { CheckInPage, SelectSeatPage } from "./page/CheckinPage.tsx";
import { TestPaymentPage } from "./page/test/TestPaymentPage.tsx";
import { FlightSearchResultPage } from "./page/FlightSearchResult.tsx";
import { TestChatboxPage } from "./page/test/TestChatbox.tsx";
import { TestAdminChatboxPage } from "./page/test/TestAdminChatbox.tsx";
import { CsrfContextProvider } from "./context/CsrfContext.tsx";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const router = createBrowserRouter([
  {
    path: "/",
    element: <HomePage />,
  },
  { path: "/home", element: <HomePage /> },
  {
    path: FLIGHTS_ROUTE,
    element: <FlightSearchPage />,
  },
  {
    path: "/flights/search/result",
    element: <FlightSearchResultPage />,
  },
  {
    path: "/flights/details/:flightId",
    element: <FlightDetailsPage />,
  },
  {
    path: "/book/:flightId",
    element: <BookFlightFillDetailForm />,
  },
  {
    path: "/book/success/:ticketId",
    element: <BookSuccessPage />,
  },
  {
    path: "/login",
    element: <LoginPage />,
  },
  {
    path: "/signup",
    element: <SignupPage />,
  },
  {
    path: "/profile",
    element: <ProfilePage />,
  },
  {
    path: "/dashboard",
    element: <UserDashboardPage />,
  },
  {
    path: "/checkin",
    element: <CheckInPage />,
  },
  {
    path: "/checkin/select-seat",
    element: <SelectSeatPage />,
  },
  {
    path: "/test-payment/:url",
    element: <TestPaymentPage />,
  },
  {
    path: "/test-chat",
    element: <TestChatboxPage />,
  },
  {
    path: "/test-admin-chat",
    element: <TestAdminChatboxPage />,
  },
]);

const queryClient = new QueryClient();
createRoot(document.getElementById("root")!).render(
  // <StrictMode>
  <QueryClientProvider client={queryClient}>
    <AuthenticationContextProvider>
      <CsrfContextProvider>
        <AppLayout>
          <RouterProvider router={router} />
        </AppLayout>
      </CsrfContextProvider>
    </AuthenticationContextProvider>
  </QueryClientProvider>
  // </StrictMode>
);
