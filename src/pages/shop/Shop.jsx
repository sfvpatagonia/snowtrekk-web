import { useEffect, useState } from "react";
import Footer from "@/components/footer/Footer";
import Header from "@/components/header/Header";
import { useParams } from "react-router-dom";
import LoadingComponent from "@/components/LoadingComponent";
import InformationCard from "./components/InformationCard";
import CategorySlider from "./components/CategorySlider";
import ServiceCard from "@/components/ServiceCard";
import shopServices from "@/services/shop";
import { useSelector } from "react-redux";

export default function Shop() {
  const [currentShop, setCurrentShop] = useState(null);
  const [loading, setLoading] = useState(true);
  const [services, setServices] = useState([]);
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const { id } = useParams();
  const user = useSelector((state) => state.user);

  const getCategories = (shopFound) => {
    const uniqueCategories = new Set();
    shopFound.Services.forEach((service) => {
      service.categories.forEach((category) => {
        uniqueCategories.add(category);
      });
    });
    setCategories([...uniqueCategories]);
  };

  useEffect(() => {
    shopServices
      .getShopById(id, user.token)
      .then((response) => {
        if (response.ok) {
          const shopFound = response.body.shop;
          setCurrentShop(shopFound);
          setProducts(shopFound.Products || []);
          setServices(shopFound.Services || []);
          getCategories(shopFound);
        } else {
          console.error("Error fetching shop:", response.message);
        }
        setLoading(false);
      })
      .catch((error) => {
        console.error("Network error:", error);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return <LoadingComponent />;
  }

  return (
    <div>
      <Header />
      <main className="flex p-4 bg-main-100 dark:bg-main-900 flex-col gap-4 min-h-[calc(100vh-60px)] items-center text-main-0 dark:text-main-1000">
        <InformationCard shop={currentShop} />
        <CategorySlider
          shop={currentShop}
          setServices={setServices}
          setProducts={setProducts}
          categories={categories}
          selectedCategory={selectedCategory}
          setSelectedCategory={setSelectedCategory}
          setLoading={setLoading}
        />
        {/* {!selectedCategory && currentShop?.ShopPolicy.returnAndRefund && (
          <section className="flex flex-col w-full max-w-7xl bg-main-50 dark:bg-main-950 text-left rounded shadow">
            <div className="flex items-center border-b border-main-600 dark:border-main-400 p-2">
              <h4 className="text-lg font-bold">Return and Refund Policy</h4>
            </div>
            <p className="p-2 text-wrap wrap-break-word whitespace-pre-wrap">
              {currentShop.ShopPolicy.returnAndRefund}
            </p>
          </section>
        )}
        {!selectedCategory && currentShop?.ShopPolicy.shipping && (
          <section className="flex flex-col w-full max-w-7xl bg-main-50 dark:bg-main-950 text-left rounded shadow">
            <div className="flex items-center border-b border-main-600 dark:border-main-400 p-2">
              <h4 className="text-lg font-bold">Shipping Policy</h4>
            </div>
            <p className="p-2 text-wrap wrap-break-word whitespace-pre-wrap">
              {currentShop?.ShopPolicy.shipping}
            </p>
          </section>
        )}
        {!selectedCategory && currentShop?.ShopPolicy.privacyPolicy && (
          <section className="flex flex-col w-full max-w-7xl bg-main-50 dark:bg-main-950 text-left rounded shadow">
            <div className="flex items-center border-b border-main-600 dark:border-main-400 p-2">
              <h4 className="text-lg font-bold">
                Use of your information and privacy Policy
              </h4>
            </div>
            <p className="p-2 text-wrap wrap-break-word whitespace-pre-wrap">
              {currentShop.ShopPolicy.privacyPolicy}
            </p>
          </section>
        )}
        {!selectedCategory && currentShop?.ShopPolicy.termsAndConditions && (
          <section className="flex flex-col w-full max-w-7xl bg-main-50 dark:bg-main-950 text-left rounded shadow">
            <div className="flex items-center border-b border-main-600 dark:border-main-400 p-2">
              <h4 className="text-lg font-bold">Terms and conditions of use</h4>
            </div>
            <p className="p-2 text-wrap wrap-break-word whitespace-pre-wrap">
              {currentShop.ShopPolicy.termsAndConditions}
            </p>
          </section>
        )} */}
        {selectedCategory && (
          <section className="grid  w-full max-w-7xl p-4 gap-4 items-start text-center justify-center grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 ">
            {services.map((service) => {
              return <ServiceCard key={service.id} item={service} />;
            })}
          </section>
        )}
      </main>
      <Footer />
    </div>
  );
}
