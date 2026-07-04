import Footer from "@/components/footer/Footer";
import Header from "@/components/header/Header";
import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import MenuNavigation from "./components/MenuNavigation";
import ShopTab from "./components/shopTab/ShopTab";
import ProductsTab from "./components/productsTab/ProductsTab";
import ServicesTab from "./components/servicesTab/ServicesTab";
import SelectShopTab from "./components/SelectShopTab";
import CreateServiceTab from "./components/createServiceTab/CreateServiceTab";
import BillingTab from "./components/billingTab/BillingTab";
import { useSelector } from "react-redux";
import SalesTab from "./components/salesTab/SalesTab";
import UpdateServiceTab from "./components/updateServiceTab/UpdateServiceTab";

function ShopProfile() {
  const navigate = useNavigate();
  const location = useLocation();
  const query = new URLSearchParams(location.search);
  const tab = query.get("tab") || "shop";
  const shop = useSelector((state) => state.shop);
  const [activeTab, setActiveTab] = useState(tab);

  const RenderTab = () => {
    switch (activeTab) {
      case "shop":
        return <ShopTab updateQuery={updateQuery} />;

      case "products":
        return <ProductsTab />;

      case "services":
        return <ServicesTab />;

      case "create-service":
        return <CreateServiceTab />;

      case "update-service":
        return <UpdateServiceTab />;

      case "sales":
        return <SalesTab />;

      case "billing":
        return <BillingTab />;

      default:
        return <SelectShopTab />;
    }
  };

  const updateQuery = (newQuery) => {
    navigate(`/my-shop?tab=${newQuery}`);
    setActiveTab(newQuery);
  };

  return (
    <div>
      <Header />
      <div className="flex p-4 bg-main-100 dark:bg-main-900 min-h-[calc(100vh-60px)]">
        <MenuNavigation activeTab={activeTab} updateQuery={updateQuery} />
        <div className="border-r-2 border-main-600 dark:border-main-400 rounded mx-4" />
        {shop.id ? <RenderTab /> : <SelectShopTab />}
      </div>
      <Footer />
    </div>
  );
}

export default ShopProfile;
