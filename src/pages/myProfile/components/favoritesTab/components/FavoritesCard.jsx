import { Link } from "react-router-dom";
import favoritesFunctions from "@/services/favorites";
import { useSelector } from "react-redux";
import { useEffect } from "react";

export default function FavoritesCard({ favorite }) {
  const user = useSelector((state) => state.user);
  const handleClick = () => {
    favoritesFunctions.setFavorite(favorite.id, user.token).then((data) => {
      if (data.ok) {
        location.reload();
      }
    });
  };

  return (
    <div className="flex flex-col sm:flex-row p-4 gap-4 rounded shadow-lg bg-main-50 dark:bg-main-950 overflow-x-hidden min-h-[150px]">
      <Link
        to={`${
          favorite.difficulty
            ? `/service/${favorite.id}`
            : `/product/${favorite.id}`
        }`}
        className="flex justify-center items-center h-full w-[150px] rounded-sm overflow-hidden bg-main-100 dark:bg-main-900 min-w-[150px]"
      >
        <img
          className="w-full aspect-square object-cover"
          src={favorite.Images[0].url}
          alt="product"
        />
      </Link>
      <div className="flex flex-col gap-2 w-full items-start">
        <div className="flex gap-2 items-baseline w-full flex-wrap">
          <Link
            to={`${
              favorite.difficulty
                ? `/service/${favorite.id}`
                : `/product/${favorite.id}`
            }`}
            className="text-main-0 dark:text-main-1000 hover:text-green-700 duration-200 ease-in border-b border-transparent hover:border-green-700"
          >
            {favorite.name}
          </Link>
          <Link
            to={`/destination/${favorite.destinations[0].id}`}
            className="text-xs text-main-0 dark:text-main-1000 hover:text-green-700 duration-200 ease-in border-b border-transparent hover:border-green-700"
          >
            at {favorite.destinations[0].name}
          </Link>
        </div>
        <div className="flex flex-col  lg:flex-row w-full justify-between gap-2">
          <div className="flex flex-col w-1/3 gap-1 min-w-[200px]">
            <div className="flex w-full gap-2 text-main-0 dark:text-main-1000">
              <p className="font-bold ">Sold by:</p>
              <p className="bg-main-100 dark:bg-main-900 flex-1 text-right px-2 rounded">
                {favorite.Shop.name}
              </p>
            </div>
            <div className="flex w-full gap-2 text-main-0 dark:text-main-1000">
              <p className="font-bold ">Price:</p>
              <p className="bg-main-100 dark:bg-main-900 flex-1 text-right px-2 rounded">
                U$D{favorite.price}
              </p>
            </div>
            <div className="flex w-full gap-2 text-main-0 dark:text-main-1000">
              <p className="font-bold ">Difficulty:</p>
              <p className="bg-main-100 dark:bg-main-900 flex-1 text-right px-2 rounded">
                {favorite.difficulty}
              </p>
            </div>
            <div className="flex w-full gap-2 text-main-0 dark:text-main-1000">
              <p className="font-bold ">Score:</p>
              <p className="bg-main-100 dark:bg-main-900 flex-1 text-right px-2 rounded">
                {favorite.averageScore || "---"}
              </p>
            </div>
          </div>
          <div className="w-full text-right lg:h-full content-end">
            <p
              className="text-main-0 dark:text-main-1000 hover:text-green-700 duration-200 ease-in hover:underline cursor-pointer"
              onClick={handleClick}
            >
              Remove from favorites
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
