import { useEffect, useState } from "react";
import Header from "../components/header/Header";
import Footer from "../components/footer/Footer";
import { Link, useParams } from "react-router-dom";
import snowLogo from "@/assets/logoST.png";
import servicesUser from "../services/user";
import { useSelector } from "react-redux";
import LoadingComponent from "@/components/LoadingComponent";
import { formatDateMMMMdYYYY } from "@/utils/dateParser";

export default function UserPage() {
  const [userVisited, setUserVisited] = useState(null);
  const [loading, setLoading] = useState(true);
  const { id } = useParams();
  const user = useSelector((state) => state.user);

  useEffect(() => {
    setLoading(true);
    try {
      servicesUser
        .getUser(id, user.token)
        .then((response) => {
          if (response.ok) {
            setUserVisited(response.body.user);
          } else {
            console.log("Navigate to 404");
          }
        })
        .finally(() => setLoading(false));
    } catch (error) {
      console.log(error);
    }
  }, []);


  if (loading) {
    return <LoadingComponent />;
  }

  return (
    <div>
      <Header />
      <main className="flex p-4 bg-main-100 dark:bg-main-900 flex-col gap-4 items-center text-main-0 dark:text-main-1000">
        <section className="flex items-start justify-center gap-4 bg-main-50 dark:bg-main-950 rounded w-full max-w-7xl p-2 shadow">
          <div className="flex items-center justify-center p-2 bg-main-100 dark:bg-main-900 rounded border border-main-600 dark:border-main-400 max-w-38">
            <img
              src={userVisited?.Images[0].url || snowLogo}
              className="w-full object-contain aspect-square"
              alt={userVisited?.name}
            />
          </div>
          <div className="flex flex-col gap-2 flex-1">
            <h1 className="text-2xl text-left font-bold">
              {userVisited?.name} {userVisited?.lastName}
            </h1>
            <p className="text-left">
              Birthday: {formatDateMMMMdYYYY(userVisited.birthDate)}
            </p>
            {userVisited.hasShop && (
              <div className="flex flex-col gap-2 text-left">
                <h2 className="font-bold">Shops</h2>
                <div className="flex gap-2 flex-wrap justify-start">
                  {userVisited.shops.map((shop) => {
                    return (
                      <Link
                        to={`shop/${shop.id}`}
                        className="duration-200 ease-in hover:text-green-700 dark:hover:text-green-500"
                      >
                        {shop.name}
                      </Link>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </section>
        <section className="flex items-start justify-center gap-4 bg-main-50 dark:bg-main-950 rounded w-full max-w-7xl p-2 shadow">
          <div className="flex w-full justify-evenly p-2 mt-2 border-t border-main-600 dark:border-main-400">
            {/* <span>Activities: {shop.Services.length}</span>
              <span>Products: {shop.Products?.length || 0}</span>
              <span>Sales amount: {shop.salesAmount}</span>
              <span>Average score: {shop.averageScore}</span> */}
            <span>Total purchased: {userVisited.Purchases.length}</span>
            <span>Favorites: {userVisited.Favorites.length}</span>
            <span>Reviews made: {userVisited.Reviews.length}</span>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
