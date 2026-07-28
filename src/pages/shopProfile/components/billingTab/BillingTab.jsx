import { useDispatch, useSelector } from "react-redux";
import ContactSupportModal from "../salesTab/components/ContactSupportModal";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { Skeleton } from "@mui/material";
import shopService from "@/services/shop";
import { selectShop } from "@/redux/shopSlice";
import InfoIcon from "@mui/icons-material/Info";
import { formatDateMMMMdYYYY } from "../../../../utils/dateParser";

export default function BillingTab() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [supportOpen, setSupportOpen] = useState(false);
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(true);
  const [shop, setShop] = useState({});
  const shopRedux = useSelector((state) => state.shop);
  const user = useSelector((state) => state.user);

  useEffect(() => {
    shopService
      .getShopById(shopRedux.id, user.token)
      .then((data) => {
        if (data.ok) {
          setShop(data.body.shop);
        }
      })
      .catch((error) => setError(error))
      .finally(() => setLoading(false));
  }, []);

  return (
    <main className="flex flex-col flex-1 items-center gap-4 max-w-full overflow-hidden py-4  ">
      <div className="flex justify-between w-full items-center">
        <button
          className="button"
          style={{ alignSelf: "start" }}
          onClick={() => {
            dispatch(selectShop({ id: null, name: "" }));
            navigate("/my-shop");
          }}
        >
          Back to select shop
        </button>
        <button className="button" onClick={() => setSupportOpen(true)}>
          Contact Support
        </button>
      </div>

      {loading ? (
        <div className="w-full max-w-[1024px] flex flex-col gap-4 shadow">
          <Skeleton height={150} width={"100%"} variant="rectangular" />
          <Skeleton height={400} width={"100%"} variant="rectangular" />
        </div>
      ) : error ? (
        <div className="text-main-0 dark:text-main-1000 text-lg text-left">
          Error loading sales statistics.
        </div>
      ) : (
        <>
          {shop.isNew && (
            <div className="bg-main-200 dark:bg-main-600 text-black dark:text-white p-4 rounded w-full max-w-[1024px] flex  gap-1 shadow items-center">
              <InfoIcon className="" />
              <p className=" w-full text-left text-lg py-1 px-2">
                Your shop is currently {shop.status}. Please wait while our team
                review the information provided and they will contact you to
                activate it. If you have any questions, feel free to contact
                support.
              </p>
            </div>
          )}
          {shop.status === "pending" && (
            <div className="bg-main-200 dark:bg-main-600 text-black dark:text-white p-4 rounded w-full max-w-[1024px] flex  gap-1 shadow items-center">
              <InfoIcon className="" />
              <p className=" w-full text-left text-lg py-1 px-2">
                You payment is currently pending. As soon as it is approved, our
                team will activate your shop. If you have any questions, feel
                free to contact support.
              </p>
            </div>
          )}
          {shop.status === "suspended" && (
            <div className="bg-main-200 dark:bg-main-600 text-black dark:text-white p-4 rounded w-full max-w-[1024px] flex  gap-1 shadow items-center">
              <InfoIcon className="" />
              <p className=" w-full text-left text-lg py-1 px-2">
                Your shop is currently suspended. If you have any questions,
                feel free to contact support.
              </p>
            </div>
          )}
          <section className="bg-main-50 dark:bg-main-950 p-4 rounded w-full max-w-[1024px] flex flex-col gap-4 shadow text-main-0 dark:text-main-1000">
            <h2 className="md:block font-bold  text-left w-full max-w-[1024px] mx-auto">
              Billing details
            </h2>
            <div className="flex w-full justify-between items-center gap-4">
              <div className="bg-main-100 dark:bg-main-900 p-4 rounded-lg flex-1">
                <h3 className="text-sm text-gray-500 dark:text-gray-200">
                  Subscription Status
                </h3>

                <p className="text-xl font-bold capitalize">{shop.status}</p>
              </div>

              <div className="bg-main-100 dark:bg-main-900 p-4 rounded-lg flex-1">
                <h3 className="text-sm text-gray-500 dark:text-gray-200">
                  Subscription Plan
                </h3>

                <p className="text-xl font-bold">
                  {shop.subscriptionPrice !== 0.0
                    ? "U$D" + shop.subscriptionPrice?.toFixed(2)
                    : "Free"}
                </p>
              </div>

              <div className="bg-main-100 dark:bg-main-900 p-4 rounded-lg flex-1">
                <h3 className="text-sm text-gray-500 dark:text-gray-200">
                  Commission Fee
                </h3>

                <p className="text-xl font-bold">
                  {shop.commissionRate * 100 || 0}%
                </p>
              </div>

              <div className="bg-main-100 dark:bg-main-900 p-4 rounded-lg flex-1">
                <h3 className="text-sm text-gray-500 dark:text-gray-200">
                  Subscription start at
                </h3>

                <p className="text-xl font-bold">
                  {formatDateMMMMdYYYY(shop.subscriptionStartDate) || "-"}
                </p>
              </div>
            </div>
          </section>
        </>
      )}

      <ContactSupportModal
        open={supportOpen}
        onClose={() => setSupportOpen(false)}
      />
    </main>
  );
}
