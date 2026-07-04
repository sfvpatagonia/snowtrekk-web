import OrderItemsBy from "@/components/orderItemsBy/OrderItemsBy";
import PurchaseCard from "./components/PurchaseCard";
import { useSelector } from "react-redux";
import { useEffect, useState } from "react";
import purchaseFunctions from "@/services/purchase";
import LoadingComponent from "@/components/LoadingComponent";
import { Skeleton } from "@mui/material";

export default function PurchasesTab() {
  const user = useSelector((state) => state.user);
  const [purchases, setPurchases] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (user.id) {
      purchaseFunctions
        .getMyPurchases(user.token)
        .then((data) => {
          if (data.ok) {
            setPurchases(data.body.purchases);
          } else {
            setError("An error has occurred. Try again later");
          }
        })
        .finally(() => {
          setLoading(false);
        });
    }
  }, []);

  // if (loading) {
  //   return (
  //     <main className="flex flex-col flex-1 items-center gap-2 max-w-full overflow-hidden py-4">
  //       <LoadingComponent />
  //     </main>
  //   );
  // }

  return (
    <main className="flex flex-col flex-1 items-center gap-2 max-w-full overflow-hidden py-4">
      <OrderItemsBy />
      <h2 className="hidden md:block font-bold text-main-0 dark:text-main-1000 text-left w-full max-w-[1024px] mx-auto">
        My Purchases
      </h2>
      <div className="max-w-[1024px] w-full mx-auto">
        <ul className="flex flex-col gap-2">
          {loading ? (
            <>
              <Skeleton variant="rounded" height={250} />
              <Skeleton variant="rounded" height={250} />
              <Skeleton variant="rounded" height={250} />
            </>
          ) : error ? (
            <p className="text-red-600 w-full text-left text-lg py-8 px-2">
              {error}
            </p>
          ) :  purchases.length === 0 ? 
          <h4>
            There are no purchases yet
          </h4>
          :(
            purchases.map((purchase, index) => (
              <PurchaseCard purchase={purchase} key={index} />
            ))
          )}
        </ul>
      </div>
    </main>
  );
}
