import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import Calendar from "./components/Calendar";
import WeekCalendar from "./components/WeekCalendar";
import MenuNavigation from "../MenuNavigation";
import Header from "@/components/header/Header";
import { useEffect, useState } from "react";
import service from "@/services/service.js";
import LoadingComponent from "@/components/LoadingComponent.jsx";
import { selectCurrentService } from "@/redux/shopSlice.js";

export default function AvailabilityTab() {
  const dispatch = useDispatch();
  const [currentService, setCurrentService] = useState(null);
  const [selected, setSelected] = useState([]);

  const navigate = useNavigate();
  const user = useSelector((state) => state.user);
  const shop = useSelector((state) => state.shop);
  const idService = shop.currentServiceId;

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!idService) {
      return navigate(-1);
    }
    service
      .getServiceById(idService, user.token)
      .then((data) => {
        if (data.ok) {
          setCurrentService(data.body.service);
          setSelected(data.body.service.mold);
        }
      })
      .finally(() => setLoading(false));
    return () => {
      dispatch(selectCurrentService(null));
    };
  }, []);

  const updateQuery = (newQuery) => {
    navigate(`/my-shop?tab=${newQuery}`);
    setActiveTab(newQuery);
  };

  if (loading) {
    return <LoadingComponent />;
  }

  return (
    <div>
      <Header />
      <div className="flex p-4 bg-main-100 dark:bg-main-900 min-h-[calc(100vh-60px)]">
        <MenuNavigation activeTab={""} updateQuery={updateQuery} />
        <div className="border-r-2 border-main-600 dark:border-main-400 rounded mx-4" />
        <main className="flex flex-col flex-1 items-center py-4 gap-2 w-full max-w-[992px] mx-auto overflow-auto text-main-0 dark:text-main-1000 ">
          <h1 className="text-2xl font-bold w-full text-main-600 dark:text-main-400">
            Set up your availability
          </h1>
          <h2 className="text-xl font-bold w-full text-left">
            What is your usual schedule for this service?
          </h2>
          <h3 className="w-full text-left">
            If the availability is not set, the service will not show for the
            users
          </h3>
          <h4 className="w-full text-left text-sm">
            (You will handle exceptions in the next section)
          </h4>

          <WeekCalendar
            selected={selected}
            setSelected={setSelected}
            duration={currentService?.duration}
          />
          <h2 className="text-2xl font-bold w-full text-left">
            Set your availability schedule for this service
          </h2>

          <Calendar weekDays={selected} currentService={currentService} />
        </main>
      </div>
    </div>
  );
}
