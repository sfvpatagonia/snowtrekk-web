import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import shopService from "@/services/shop";
import { useDispatch, useSelector } from "react-redux";
import { selectShop } from "@/redux/shopSlice";
import giveDefaultImage from "@/utils/profileshoppic";
import { Skeleton } from "@mui/material";

export default function SelectShopTab() {
  const [shops, setShops] = useState([]);
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(``);

  useEffect(() => {
    shopService
      .getShopsByUserId(user.id, user.token)
      .then((data) => {
        if (data.ok) {
          setShops(data.body.shops);
        } else {
          setError(data.message);
        }
      })
      .catch((error) =>
        setError(`An error occurred: ${error}, please try again later.`)
      )
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="flex flex-col flex-1 items-center overflow-hidden py-4 gap-2 max-w-full">
      <div className="flex w-full">
        <h2 className="hidden md:block font-bold text-main-0 dark:text-main-1000 text-left w-full max-w-[1024px] mx-auto">
          Select your shop
        </h2>
        <Link to={"/my-profile?tab=create-shop"}>
          <button className={`button text-nowrap`}>Create new shop</button>
        </Link>
      </div>
      <ul className="flex w-full max-w-[1024px] flex-wrap justify-center gap-4 ">
        {loading ? (
          <>
            <Skeleton
              variant="rectangular"
              width={200}
              height={200}
              classes={{
                root: "rounded",
              }}
            />
            <Skeleton
              variant="rectangular"
              width={200}
              height={200}
              classes={{
                root: "rounded",
              }}
            />
            <Skeleton
              variant="rectangular"
              width={200}
              height={200}
              classes={{
                root: "rounded",
              }}
            />
            <Skeleton
              variant="rectangular"
              width={200}
              height={200}
              classes={{
                root: "rounded",
              }}
            />
            <Skeleton
              variant="rectangular"
              width={200}
              height={200}
              classes={{
                root: "rounded",
              }}
            />
            <Skeleton
              variant="rectangular"
              width={200}
              height={200}
              classes={{
                root: "rounded",
              }}
            />
          </>
        ) : error ? (
          <p className="text-red-600 w-full text-left text-lg py-8 px-2">
            {error}
          </p>
        ) : (
          shops.map((shop, index) => (
            <li key={index}>
              <Link
                to={`/my-shop?tab=shop`}
                key={index}
                className="flex flex-col items-start w-[200px] p-2 bg-main-50 dark:bg-main-950 rounded shadow"
                onClick={() =>
                  dispatch(selectShop({ id: shop.id, name: shop.name }))
                }
              >
                <div className="flex w-full aspect-square bg-main-100 dark:bg-main-900 border-b-2 border-main-600 dark:border-main-400">
                  <img
                    src={shop.Image?.url || giveDefaultImage(index)}
                    className="w-full object-contain"
                    alt="shop logo"
                  />
                </div>
                <h2 className="text-main-600 dark:text-main-400 text-left w-full whitespace-nowrap text-ellipsis overflow-hidden">
                  {shop.name}
                </h2>
                {shop.parentShop ? (
                  <p className="text-sm text-main-0 dark:text-main-1000 text-left w-full whitespace-nowrap overflow-hidden text-ellipsis">
                    {shop.parentShop.name}´s branch
                  </p>
                ) : (
                  <p className="text-sm text-main-0 dark:text-main-1000 text-left w-full whitespace-nowrap overflow-hidden text-ellipsis">
                    {shop.type}
                  </p>
                )}
              </Link>
            </li>
          ))
        )}
      </ul>
    </div>
  );
}
