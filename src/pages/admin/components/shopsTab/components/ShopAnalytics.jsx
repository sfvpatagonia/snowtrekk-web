import {
  calculateShopAverageScore,
  calculateShopViews,
} from "@/utils/shopHelpers";

const ShopAnalytics = ({ shop }) => {
  const services = shop.Services || [];

  const avgScore = calculateShopAverageScore(services);
  const totalViews = calculateShopViews(services);

  return (
    <div className="grid grid-cols-2 gap-6 text-black dark:text-white">
      <div className="bg-main-50 dark:bg-main-950 p-4 rounded-lg">
        <h3 className="text-sm text-gray-500 dark:text-gray-200">Total Services</h3>
        <p className="text-xl font-bold">{services.length}</p>
      </div>

      <div className="bg-main-50 dark:bg-main-950 p-4 rounded-lg">
        <h3 className="text-sm text-gray-500 dark:text-gray-200">Average Score</h3>
        <p className="text-xl font-bold">{avgScore ?? "No reviews"}</p>
      </div>

      <div className="bg-main-50 dark:bg-main-950 p-4 rounded-lg">
        <h3 className="text-sm text-gray-500 dark:text-gray-200">Total Views</h3>
        <p className="text-xl font-bold">{totalViews}</p>
      </div>

      <div className="bg-main-50 dark:bg-main-950 p-4 rounded-lg">
        <h3 className="text-sm text-gray-500 dark:text-gray-200">Sales Amount</h3>
        <p className="text-xl font-bold">{shop.salesAmount}</p>
      </div>
    </div>
  );
};

export default ShopAnalytics;
