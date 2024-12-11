import { useEffect } from "react";
import { useParams } from "react-router";
import { SimpleLoadingScreen } from "../../component/SimpleLoading";

export function TestPaymentPage() {
  const { url } = useParams();

  useEffect(() => {
    setTimeout(async () => {
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
    }, 2000);
    // setTimeout(() => {
    //   alert("Payment failed");
    //   window.location.href = "/";
    // }, 6000);
  }, [url]);

  return (
    <div>
      <h1>Test Payment Page</h1>
      <SimpleLoadingScreen />
    </div>
  );
}
