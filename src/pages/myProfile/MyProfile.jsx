import Footer from "@/components/footer/Footer";
import Header from "@/components/header/Header";
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import MenuNavigation from "./components/MenuNavigation";
import InformationTab from "./components/informationTab/InformationTab";
import PurchasesTab from "./components/purchasesTab/PurchasesTab";
import FavoritesTab from "./components/favoritesTab/FavoritesTab";
import ReviewsTab from "./components/reviewsTab/ReviewsTab";
import { useDispatch, useSelector } from "react-redux";
import userFunctions from "@/services/user";
import { addUser } from "@/redux/userSlice";
import CreateShopTab from "./components/createShopTab/CreateShopTab";

export default function MyProfile() {
  const user = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const query = new URLSearchParams(location.search);
  const tab = query.get("tab") || "information";
  const [activeTab, setActiveTab] = useState(tab);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const updateQuery = (newQuery) => {
    navigate(`/my-profile?tab=${newQuery}`);
    setActiveTab(newQuery);
  };

  useEffect(() => {
    if (user.id) {
      userFunctions
        .getCurrentUser(user.token)
        .then((data) => {
          if (data.ok) {
            dispatch(addUser({ ...data.body.user, token: user.token }));
          }
        })
        .catch((error) => setError(error))
        .finally(() => setLoading(false));
    }
  }, []);

  const renderTab = () => {
    switch (activeTab) {
      case "information":
        return <InformationTab user={user} loading={loading} error={error} />;
      case "purchases":
        return <PurchasesTab />;
      case "favorites":
        return <FavoritesTab />;
      case "reviews":
        return <ReviewsTab reviews={user.reviews || []} />;
      case "create-shop":
        return <CreateShopTab />;
      case "claims":
        return <div>Claims</div>;
    }
  };

  return (
    <div>
      <Header />
      <div className="flex p-4 bg-main-100 dark:bg-main-900 min-h-[calc(100vh-60px)]">
        <MenuNavigation activeTab={activeTab} updateQuery={updateQuery} />
        <div className="border-r-2 border-main-600 dark:border-main-400 rounded mx-4" />
        {renderTab()}
      </div>
      <Footer />
    </div>
  );
}
