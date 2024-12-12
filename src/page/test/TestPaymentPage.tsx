import { useParams } from "react-router";

export function TestPaymentPage() {
  const { url } = useParams();

  async function handlePayment() {
    if (!url) {
      console.log(url);
      return;
    }
    const res = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
    });

    if (!res.ok) {
      alert("Payment failed");
    }
    const json = await res.json();
    document.location.href = json.paymentReturnUrl;
  }

  return (
    <>
      {/* <h1>Test Payment Page</h1> */}
      {/* <SimpleLoadingScreen /> */}
      <CheckoutForm handlePayment={async () => await handlePayment()} />
    </>
  );
}

const CheckoutForm = ({ handlePayment }: { handlePayment: () => void }) => {
  return (
    <div className="max-w-full  min-h-screen mx-auto bg-white rounded-lg shadow-lg  grid grid-cols-1 md:grid-cols-2 gap-8">
      <div className="bg-[#2d678b] text-white flex items-center  flex-col w-full pt-20">
        <div className="w-5/12">
          <div className="flex flex-row gap-6 items-center mb-10">
            <div className="size-10 rounded-full bg-white flex justify-center items-center text-black font-bold hover:scale-125 transition-all select-none">
              T
            </div>
            <h2 className="text-3xl font-semibold text-white">Trye pay</h2>
          </div>
          <h2 className="text-2xl font-semibold text-white text-opacity-75">
            Book ticket
          </h2>
          <p className="text-4xl font-bold text-white mt-4">$129.00</p>

          <div className="mt-8">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-lg font-medium text-white">Flight LTH958</p>
                <p className="text-white">First class</p>
              </div>
              <p className="text-lg font-semibold text-white">$65.00</p>
            </div>
          </div>
        </div>
      </div>

      <div className="pt-20 flex justify-center">
        <div className="w-8/12">
          <h3 className="text-2xl font-semibold text-gray-900 mb-4">
            Checkout
          </h3>

          <div>
            <input
              type="email"
              className="w-full p-3 border border-gray-300 rounded-md mb-4"
              placeholder="Email"
            />

            <div className="mb-4">
              <label
                htmlFor="card-info"
                className="text-sm font-medium text-gray-700 mb-2 block"
              >
                Card Information
              </label>
              <input
                type="text"
                id="card-info"
                className="w-full p-3 border border-gray-300 rounded-md mb-2"
                placeholder="1234 1234 1234 1234"
              />
              <div className="flex justify-between">
                <input
                  type="text"
                  className="w-1/2 p-3 border border-gray-300 rounded-md mr-2"
                  placeholder="MM / YY"
                />
                <input
                  type="text"
                  className="w-1/2 p-3 border border-gray-300 rounded-md"
                  placeholder="CVC"
                />
              </div>
            </div>

            <div className="mb-4">
              <input
                type="text"
                className="w-full shadow-sm p-3 border border-gray-300 rounded-md mb-2"
                placeholder="Full name on card"
              />
            </div>

            <div className="mb-6">
              <label className="flex items-center space-x-2">
                <input type="checkbox" className="h-5 w-5" />
                <span className="text-sm text-gray-600">
                  Save my info for 1-click checkout with Link
                </span>
              </label>
            </div>

            <div className="flex items-center justify-between">
              <p className="text-sm text-gray-600">(800) 555-0175</p>
              <button
                onClick={() => {
                  handlePayment();
                }}
                className="bg-[#56A7C2] text-white px-6 py-3 rounded-lg  transition"
              >
                Pay
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
