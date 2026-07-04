import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import Header from "@/components/header/Header";
import Footer from "@/components/footer/Footer";
import shopService from "@/services/shop";

const STATUS_LABEL = {
  active: "Active",
  inactive: "Inactive",
  pending: "Pending activation by Snowtrekk",
  suspended: "Suspended",
};

function BusinessDashboard() {
  const user = useSelector((state) => state.user);
  const [shops, setShops] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    shopService.getShopsByUserId(user.id, user.token).then((data) => {
      if (data.ok) {
        setShops(data.body.shops);
      }
      setLoading(false);
    });
  }, [user.id]);

  return (
    <>
      <Header />
      <div className="flex flex-col gap-6 p-8 min-h-[80vh] bg-main-100 dark:bg-main-900 text-main-0 dark:text-main-1000">
        <h1 className="text-2xl font-bold">
          Hola, {user.name || "negocio"}
        </h1>

        {loading ? (
          <p>Cargando tu tienda...</p>
        ) : shops.length === 0 ? (
          <p>Todavía no tenés ninguna tienda asociada a esta cuenta.</p>
        ) : (
          <div className="flex flex-col gap-4">
            {shops.map((shop) => (
              <div
                key={shop.id}
                className="bg-main-50 dark:bg-main-950 p-6 rounded-lg shadow flex flex-col gap-2 max-w-md"
              >
                <h2 className="text-xl font-bold">{shop.name}</h2>
                <p>
                  <span className="font-semibold">Status:</span>{" "}
                  {STATUS_LABEL[shop.status] || shop.status}
                </p>
                <p>
                  <span className="font-semibold">Email:</span> {shop.email}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
      <Footer />
    </>
  );
}

export default BusinessDashboard;
