import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { clearCart } from "@/redux/cartSlice";
import createPurchase from "@/services/createPurchase";
import Footer from "../components/footer/Footer";
import Header from "../components/header/Header";

export default function CheckoutPage() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { cartItems, totalAmount } = useSelector((state) => state.cart);
  const user = useSelector((state) => state.user);
  const token = user.token;

  const itemsByShop = cartItems.reduce((acc, item) => {
    (acc[item.shopId] = acc[item.shopId] || []).push(item);
    return acc;
  }, {});

  const handleConfirm = async () => {
    setLoading(true);
    setError("");
    try {
      const payload = { cartItems, totalAmount };
      const result = await createPurchase(payload, token);
      if (result.ok) {
        dispatch(clearCart());
        navigate(`/my-profile?tab=purchases`);
      } else {
        setError(result.message || "Error al crear la compra");
      }
    } catch (e) {
      setError("Error de red network");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Header />
      <div className="flex gap-2 bg-main-100 dark:bg-main-950 lg:bg-[url('/src/assets/bg-new2.jpg')] bg-cover bg-fixed bg-blend-normal">
        <main
          className="flex flex-col w-full overflow-hidden gap-4 xl:max-w-7xl mx-auto bg-main-50 dark:bg-main-950 xl:px-6 h-[calc(100vh-60px)] overflow-y-sccr
         "
        >
          <div className="py-4 border-b-2 border-main-600 dark:border-main-400">
            <h1 className="text-3xl font-bold text-center text-main-0 dark:text-main-1000">
              Checkout
            </h1>
          </div>

          {error && <div className="text-red-600">{error}</div>}

          <div className="flex flex-col gap-8">
            {Object.entries(itemsByShop).map(([shopId, items]) => (
              <div
                key={shopId}
                className="bg-main-100 dark:bg-main-900 rounded shadow-lg p-4"
              >
                <h2 className="text-xl font-bold text-main-600 dark:text-main-400 py-2 w-full text-left">
                  {items[0]?.shopName || "Shop"}
                </h2>

                <table className="w-full bg-main-100 dark:bg-main-900 text-sm">
                  <thead>
                    <tr className="text-center text-main-1000 bg-main-600 dark:bg-main-400 overflow-hidden rounded-t-lg border-main-600 border dark:border-main-400">
                      <th className="p-2">Service</th>
                      <th>Date</th>
                      <th>Quantity</th>
                      <th>Price</th>
                      <th>Subtotal</th>
                    </tr>
                  </thead>
                  <tbody>
                    {items.map((item) => (
                      <tr
                        key={item.id}
                        className="text-center text-main-0 dark:text-main-1000 bg-main-50 dark:bg-main-950 overflow-hidden rounded-t-lg border-gray-400 border dark:border-gray-200"
                      >
                        <td className="p-2 ">{item.name}</td>
                        <td>{new Date(item.date).toLocaleDateString()}</td>
                        <td>{item.quantity}</td>
                        <td>U$D {item.price.toFixed(2)}</td>
                        <td>U$D {(item.price * item.quantity).toFixed(2)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ))}

            <div className="flex flex-col items-end gap-4 p-4 border-t-2 border-main-600 dark:border-main-400">
              <div className="flex gap-4 items-center">
                <h2 className="text-xl font-bold text-main-0 dark:text-main-1000">
                  Total Amount:
                </h2>
                <h2 className="text-2xl font-bold text-main-600 dark:text-main-400">
                  U$D {totalAmount.toFixed(2)}
                </h2>
              </div>

              <button
                className="button"
                onClick={handleConfirm}
                disabled={loading || cartItems.length === 0}
              >
                {loading ? "Processing..." : "Confirm Purchase"}
              </button>
            </div>
          </div>
        </main>
      </div>
      <Footer />
    </>
  );
}
