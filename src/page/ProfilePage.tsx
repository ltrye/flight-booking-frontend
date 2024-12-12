import { useContext, useEffect } from "react";
import { Logout } from "../api/UserAPI";

import { AuthenticatonContext } from "../context/AuthenticationContext";
import { SimpleLoadingScreen } from "../component/SimpleLoading";

export function ProfilePage() {
  const { userDetails, isLoading, isAuthenticated } =
    useContext(AuthenticatonContext);

  useEffect(() => {
    if (!isLoading && isAuthenticated == false) {
      document.location.href = "/login";
    }
  }, [isAuthenticated, isLoading, userDetails]);

  if (isLoading) {
    return <SimpleLoadingScreen />;
  }
  async function handleLogout() {
    await Logout();
    document.location.href = "/login";
  }
  return (
    <>
      {isLoading && <SimpleLoadingScreen />}
      {!isLoading && (
        <div className="bg-white lg:w-2/4 max-w-5xl shadow overflow-hidden sm:rounded-lg mx-auto md:mt-20 md:mb-20">
          <div className="px-4 py-5 sm:px-6">
            <h3 className="text-lg leading-6 font-medium text-gray-900">
              Account information
            </h3>
          </div>
          <div className="border-t border-gray-200">
            <dl>
              <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt className="text-sm font-medium text-gray-500">Full name</dt>
                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                  {userDetails?.fullName}
                </dd>
              </div>
              <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt className="text-sm font-medium text-gray-500">Email</dt>
                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                  {userDetails?.email}
                </dd>
              </div>
              <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt className="text-sm font-medium text-gray-500">
                  Phone number
                </dt>
                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                  {userDetails?.phoneNumber}
                </dd>
              </div>
              <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt className="text-sm font-medium text-gray-500">
                  Date of birth
                </dt>
                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                  {userDetails?.dateOfBirth ?? "Not set"}
                </dd>
              </div>
            </dl>
          </div>
        </div>
      )}
      <button
        className="bg-blue-500 text-white rounded-lg mb-10 px-4 py-2 mx-auto block"
        onClick={handleLogout}
      >
        Logout
      </button>
    </>
  );
}
