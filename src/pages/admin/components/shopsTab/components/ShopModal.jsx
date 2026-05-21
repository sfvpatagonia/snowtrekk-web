import { useState } from "react";
import ShopDetails from "./ShopDetails";
import ShopServices from "./ShopServices";
import ShopAnalytics from "./ShopAnalytics";
import ShopLocations from "./ShopLocations";
import ShopBilling from "./ShopBilling";
import { Modal } from "@mui/material";

const ShopModal = ({ open, onClose, shop, setShop, setMessage, setError }) => {
  const [tab, setTab] = useState("details");

  if (!shop) return null;

  const tabs = [
    { key: "details", label: "Details" },
    { key: "services", label: "Services" },
    { key: "analytics", label: "Analytics" },
    { key: "locations", label: "Locations" },
    { key: "billing", label: "Billing" },
  ];

  const renderTab = () => {
    switch (tab) {
      case "details":
        return <ShopDetails shop={shop} />;
      case "services":
        return <ShopServices services={shop.Services} />;
      case "analytics":
        return <ShopAnalytics shop={shop} />;
      case "locations":
        return <ShopLocations services={shop.Services} />;
      case "billing":
        return (
          <ShopBilling
            shop={shop}
            setShop={setShop}
            setMessage={setMessage}
            setError={setError}
          />
        );

      default:
        return null;
    }
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      className="p-4 flex justify-center items-center "
    >
      <div className="max-h-10/12 w-9/12 space-y-6 bg-main-100 dark:bg-main-900 p-12 rounded overflow-auto">
        <h2 className="text-2xl font-bold text-black dark:text-white">
          {shop.name}
        </h2>

        {/* Tabs */}
        <div className="flex gap-3 border-b pb-2">
          {tabs.map((t) => (
            <button
              key={t.key}
              onClick={() => setTab(t.key)}
              className="button"
            >
              {t.label}
            </button>
          ))}
        </div>

        {/* Content */}
        <div>{renderTab()}</div>
      </div>
    </Modal>
  );
};

export default ShopModal;
