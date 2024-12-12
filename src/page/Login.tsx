import { FormEvent, FormEventHandler, useContext, useState } from "react";
import { Login, LoginRequest } from "../api/auth/AuthenticationAPI";
import { Link, useNavigate } from "react-router-dom";

//Image
import LoginImage from "../assets/LoginImage.jpg";

import { useUserDeviceId } from "../hooks/useUserDeviceId";
import { AuthenticatonContext } from "../context/AuthenticationContext";
import { SimpleLoading, SimpleLoadingScreen } from "../component/SimpleLoading";
import { useMutation } from "@tanstack/react-query";

export function LoginPage() {
  // const {isAuthenticated} = useRedirectIfAuthenticated("/profile");
  const {
    isAuthenticated,
    isLoading: isUserLoading,
    userDetails,
    invalidateContext,
  } = useContext(AuthenticatonContext);

  const navigate = useNavigate();
  const userDeviceId = useUserDeviceId();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const { mutate: handleLogin, isPending } = useMutation({
    mutationFn: Login,
    onError: (error) => {
      if (error instanceof Error) {
        alert("Login failed! " + error.message);
      }
    },
    onSuccess: () => {
      alert("Login successful");
      invalidateContext();
      navigate("/profile");
    },
  });
  if (isUserLoading) {
    return (
      <div className="h-screen flex justify-center items-center">
        <SimpleLoadingScreen />
      </div>
    );
  }

  if (userDetails !== null) {
    navigate("/profile");
    return;
  }

  const loginHandler: FormEventHandler = async (e: FormEvent) => {
    e.preventDefault();
    console.log(userDeviceId);
    const request: LoginRequest = {
      email: email,
      password: password,
      requestDeviceInfo: {
        deviceId: userDeviceId!,
      },
    };

    handleLogin(request);
  };

  if (isAuthenticated === null || isAuthenticated) {
    return null;
  }

  return (
    <section className="bg-white">
      <div className="lg:grid lg:min-h-screen lg:grid-cols-12">
        <aside className="relative block h-16 lg:order-last lg:col-span-5 lg:h-full xl:col-span-6">
          <img
            alt=""
            src={LoginImage}
            className="absolute inset-0 h-full w-full object-cover"
          />
        </aside>

        <main className="flex items-center justify-center px-8 py-8 sm:px-12 lg:col-span-7 lg:px-16 lg:py-12 xl:col-span-6">
          <div className="max-w-xl lg:max-w-3xl">
            <a className="block text-blue-600" href="#">
              <span className="sr-only">Home</span>
            </a>

            <h1 className="mt-6 text-2xl font-bold text-gray-900 sm:text-3xl md:text-4xl">
              Welcome to DFlight
            </h1>

            <p className="mt-4 leading-relaxed text-gray-500">
              Lorem, ipsum dolor sit amet consectetur adipisicing elit. Eligendi
              nam dolorum aliquam, quibusdam aperiam voluptatum.
            </p>

            <form
              onSubmit={loginHandler}
              className="mt-8 grid grid-cols-6 gap-6"
            >
              <div className="col-span-6">
                <label
                  htmlFor="Email"
                  className="block text-sm font-medium text-gray-700"
                >
                  {" "}
                  Email{" "}
                </label>

                <input
                  onChange={(e) => setEmail(e.target.value)}
                  type="email"
                  id="Email"
                  name="email"
                  className="mt-1 w-full rounded-md border-gray-200 bg-white text-sm text-gray-700 shadow-sm"
                />
              </div>

              <div className="col-span-6 sm:col-span-3">
                <label
                  htmlFor="Password"
                  className="block text-sm font-medium text-gray-700"
                >
                  {" "}
                  Password{" "}
                </label>

                <input
                  onChange={(e) => setPassword(e.target.value)}
                  type="password"
                  id="Password"
                  name="password"
                  className="mt-1 w-full rounded-md border-gray-200 bg-white text-sm text-gray-700 shadow-sm"
                />
              </div>

              <div className="col-span-6 sm:flex sm:items-center sm:gap-4">
                <button
                  disabled={isPending}
                  className="inline-block shrink-0 rounded-md border border-blue-600 bg-blue-600 px-12 py-3 text-sm font-medium text-white transition hover:bg-transparent hover:text-blue-600 focus:outline-none focus:ring active:text-blue-500"
                >
                  Login
                </button>

                <p className="mt-4 text-sm text-gray-500 sm:mt-0">
                  Don't have an account?{" "}
                  <Link to="/signup" className="text-gray-700 underline">
                    Create an account
                  </Link>
                  .
                </p>
                {isPending && <SimpleLoading />}
                <div></div>
              </div>
            </form>
          </div>
        </main>
      </div>
    </section>
  );
}
