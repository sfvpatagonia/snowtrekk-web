import OrderItemsBy from "@/components/orderItemsBy/OrderItemsBy";
import FavoritesCard from "./components/FavoritesCard";
import { useEffect, useState } from "react";
import favoritesFunctions from "@/services/favorites";
import { useSelector } from "react-redux";
import { Skeleton } from "@mui/material";

export default function FavoritesTab() {
  const user = useSelector((state) => state.user);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [favorites, setFavorites] = useState([]);

  useEffect(() => {
    favoritesFunctions
      .getFavorites(user.token)
      .then((data) => {
        if (data.ok) {
          setFavorites(data.body.favorites);
        } else {
          setError("An error has occurred. Try again later");
        }
      })
      .finally(() => setLoading(false));
  }, []);

  return (
    <main className="flex flex-col flex-1 items-center gap-2 max-w-full overflow-hidden py-4">
      <OrderItemsBy />
      <h2 className="hidden md:block font-bold text-main-0 dark:text-main-1000 text-left w-full max-w-[1024px] mx-auto">
        My Favorites
      </h2>
      <div className="max-w-[1024px] w-full mx-auto">
        <ul className="flex flex-col gap-2">
          {loading ? (
            <>
              <Skeleton variant="rounded" height={150} />
              <Skeleton variant="rounded" height={150} />
              <Skeleton variant="rounded" height={150} />
              <Skeleton variant="rounded" height={150} />
              <Skeleton variant="rounded" height={150} />
            </>
          ) : error ? (
            <p className="text-red-600 w-full text-left text-lg py-8 px-2">
              {error}
            </p>
          ) : 
          favorites.length === 0 ? 
          <h4>
            There are no favorites yet
          </h4>
          :(
            favorites.map((favorite, index) => (
              <FavoritesCard favorite={favorite.Service} key={index} />
            ))
          )}
        </ul>
      </div>
    </main>
  );
}
