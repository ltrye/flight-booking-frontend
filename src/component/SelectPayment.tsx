import { useMutation } from "@tanstack/react-query";
import { pay as getPayUrl } from "../api/PaymentAPI";
import { APP_URL } from "../constant/AppConstant";
import { SimpleLoadingScreen } from "./SimpleLoading";

export function SelectPayment({ bookingId }: { bookingId: string }) {
  const options = ["Momo", "VNPay", "Bank"];

  const { mutate: getPaymentUrlMutate, isPending } = useMutation({
    mutationFn: getPayUrl,
    onError: (error) => {
      if (error instanceof Error) {
        alert("Payment failed! " + error.message);
      }
    },
    onSuccess: (data) => {
      document.location.href =
        "/test-payment/" + encodeURIComponent(data.paymentUrl);
    },
  });

  async function onPaymentMethodSelected(option: string) {
    getPaymentUrlMutate({
      bookingId: bookingId,
      paymentMethod: option,
      paymentReturnUrl: `${APP_URL}/book/success/${bookingId}`,
    });
  }

  return (
    <div>
      <h1 className="text-lg mb-5">Select Payment Method </h1>
      <div className="flex  flex-col space-y-4 justify-start ">
        {options.map((option) => (
          <button
            onClick={async () => await onPaymentMethodSelected(option)}
            className="bg-blue-500 text-white  py-2 rounded-md shadow-md hover:bg-blue-600"
          >
            {option}
          </button>
        ))}
      </div>
      {isPending && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-50 flex items-center justify-center">
          <SimpleLoadingScreen />
        </div>
      )}
    </div>
  );
}
