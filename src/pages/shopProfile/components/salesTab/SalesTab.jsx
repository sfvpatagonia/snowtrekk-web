import { useEffect, useState } from "react";
import { Skeleton } from "@mui/material";
import { useSelector } from "react-redux";
import OrdersTable from "./components/OrdersTable";
import salesService from "@/services/sales";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { selectShop } from "@/redux/shopSlice";
import ContactSupportModal from "./components/ContactSupportModal";
import SalesStadistics from "./components/SalesStadistics";

export default function SalesTab() {
  const [orders, setOrders] = useState([]);
  const user = useSelector((state) => state.user);
  const shop = useSelector((state) => state.shop);
  const [mostFrequentActivities, setMostFrequentActivities] = useState([]);
  const [topProducts, setTopProducts] = useState([]);
  const [mostViewedService, setMostViewedService] = useState(null);
  const [bestScoredService, setBestScoredService] = useState(null);
  const [monthlySales, setMonthlySales] = useState([]);
  const [bestMonth, setBestMonth] = useState("");
  const [currentMonthSales, setCurrentMonthSales] = useState(0);
  const [currentMonthSold, setCurrentMonthSold] = useState(0);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [shopId, setShopId] = useState(null);
  const [supportOpen, setSupportOpen] = useState(false);
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!shop?.id) {
      navigate("/my-shop");
      return;
    }

    // Traer datos del backend
    salesService
      .getShopSales(shop.id, user.token)
      .then((data) => {
        if (data.ok && Array.isArray(data.orders)) {
          setOrders(data.orders);

          // Calcular las actividades más frecuentes basadas en "sold"
          // const activityCount = {};
          // data.orders.forEach((order) => {
          //   order.services.forEach((service) => {
          //     activityCount[service.name] = (activityCount[service.name] || 0) + service.sold;
          //   });
          // });

          // Calcular las actividades más frecuentes basadas en cantidad vendida

          // Filtrar solo órdenes completadas
          const completedOrders = data.orders.filter(
            (order) => order.status === "completed"
          );

          // Calcular las actividades más frecuentes basadas en cantidad vendida
          const activityCount = {};
          completedOrders.forEach((order) => {
            order.services.forEach((service) => {
              let totalQuantity = 0;
              if (Array.isArray(service.OrderServices)) {
                totalQuantity = service.OrderServices.reduce(
                  (sum, os) => sum + (os.quantity || 0),
                  0
                );
              }
              activityCount[service.name] =
                (activityCount[service.name] || 0) + totalQuantity;
            });
          });

          const sortedActivities = Object.entries(activityCount).sort(
            (a, b) => b[1] - a[1]
          );
          setMostFrequentActivities(sortedActivities.slice(0, 5));
          setTopProducts(sortedActivities.slice(0, 3));

          // Servicio más visto
          const mostViewed = data.orders
            .flatMap((order) => order.services)
            .reduce(
              (prev, current) => (prev.views > current.views ? prev : current),
              {}
            );
          setMostViewedService(mostViewed);

          // Mejor puntuado
          const bestScored = data.orders
            .flatMap((order) => order.services)
            .reduce(
              (prev, current) =>
                (current.averageScore || 0) > (prev.averageScore || 0)
                  ? current
                  : prev,
              {}
            );
          setBestScoredService(bestScored);

          // Ventas mensuales
          const salesByMonth = {};
          data.orders.forEach((order) => {
            const month = new Date(order.createdAt).toLocaleString("en-US", {
              month: "long",
            });
            salesByMonth[month] = (salesByMonth[month] || 0) + order.orderTotal;
          });
          const monthlySalesArray = Object.entries(salesByMonth).sort(
            ([, a], [, b]) => b - a
          );
          setMonthlySales(monthlySalesArray);

          // Mejor mes
          if (monthlySalesArray.length > 0) {
            setBestMonth(monthlySalesArray[0][0]);
          }

          // Ventas del mes actual
          const currentMonth = new Date().toLocaleString("default", {
            month: "long",
          });
          const currentMonthTotal = data.orders
            .filter((order) => {
              const orderMonth = new Date(order.createdAt).toLocaleString(
                "default",
                { month: "long" }
              );
              return orderMonth === currentMonth;
            })
            .reduce((sum, order) => sum + order.orderTotal, 0);
          setCurrentMonthSales(currentMonthTotal);

          // Cantidad vendida del mes actual
          const currentMonthSoldTotal = data.orders
            .filter((order) => {
              const orderMonth = new Date(order.createdAt).toLocaleString(
                "default",
                { month: "long" }
              );
              return orderMonth === currentMonth;
            })
            .flatMap((order) => order.services)
            .reduce((sum, service) => sum + (service.sold || 0), 0);
          setCurrentMonthSold(currentMonthSoldTotal);
        } else {
          setOrders([]);
          setMostFrequentActivities([]);
          setTopProducts([]);
          setMostViewedService(null);
          setBestScoredService(null);
          setMonthlySales([]);
          setBestMonth("");
          setCurrentMonthSales(0);
          setCurrentMonthSold(0);
        }
      })
      .catch((err) => {
        console.error("Error fetching sales data:", err);
        setError(true);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [shop, user.token, navigate]);

  useEffect(() => {
    if (!shop?.id) {
      navigate("/my-shop");
    }
  }, [shop, navigate]);

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
          <Skeleton height={700} width={"100%"} variant="rectangular" />
          <Skeleton height={700} width={"100%"} variant="rectangular" />
        </div>
      ) : error ? (
        <div className="text-main-0 dark:text-main-1000 text-lg text-left">
          Error loading sales statistics.
        </div>
      ) : (
        <>
          <SalesStadistics
            mostFrequentActivities={mostFrequentActivities}
            monthlySales={monthlySales}
            mostViewedService={mostViewedService}
            bestScoredService={bestScoredService}
            topProducts={topProducts}
            bestMonth={bestMonth}
            currentMonthSales={currentMonthSales}
            currentMonthSold={currentMonthSold}
          />
          <section className="bg-main-50 dark:bg-main-950 p-4 rounded w-full max-w-[1024px] flex flex-col gap-4 shadow">
            <h2 className="md:block font-bold text-main-0 dark:text-main-1000 text-left w-full max-w-[1024px] mx-auto">
              Sales
            </h2>
            <OrdersTable orders={orders} />
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
