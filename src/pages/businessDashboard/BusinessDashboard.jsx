import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import Header from "@/components/header/Header";
import Footer from "@/components/footer/Footer";
import shopService from "@/services/shop";
import userService from "@/services/user";
import { logout } from "@/redux/userSlice";

const STATUS_LABEL = {
  active: "Active",
  inactive: "Inactive",
  pending: "Pending activation by Snowtrekk",
  suspended: "Suspended",
};

function BusinessDashboard() {
  const user = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();
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

  const handleLogout = async () => {
    await userService.logout();
    dispatch(logout());
    navigate("/");
  };

  return (
    <>
      <Header />
      <div className="flex flex-col gap-6 p-8 min-h-[80vh] bg-main-100 dark:bg-main-900 text-main-0 dark:text-main-1000">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">
            Hola, {user.name || "negocio"}
          </h1>
          <button className="button" onClick={handleLogout}>
            Logout
          </button>
        </div>

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
