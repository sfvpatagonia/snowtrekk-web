import { Link } from "react-router-dom";
import giveDefaultImage from "@/utils/profileshoppic";

export default function ListItems({ items }) {
  return (
    <div className="flex w-full flex-col gap-2 sm:w-[400px] bg-main-50 dark:bg-main-950 max-h-full overflow-y-auto p-2 shadow rounded-br">
      {items.flatMap((item, index) => {
        const review = item.Reviews.find(
          (review) => review.idOrderService === item.OrderService.id
        );
        return (
          <div
            className="flex h-[100px] bg-main-100 dark:bg-main-900 rounded-sm p-2 text-main-0 dark:text-main-1000 "
            key={index}
          >
            <Link to={`/service/${item.id}`}>
              <img
                className="h-full aspect-square object-cover bg-main-50 dark:bg-main-950 rounded-xs overflow-hidden hover:scale-110 duration-300 ease-in"
                src={item.Images ? item.Images[0].url : giveDefaultImage(1)}
                alt={item.name}
              />
            </Link>
            <div className="flex flex-col w-full overflow-hidden text-left">
              <Link to={`/service/${item.id}`}>
                <p className="text-ellipsis whitespace-nowrap overflow-hidden max-w-full px-1 duration-200 ease-in hover:underline hover:text-green-700 dark:hover:text-green-500">
                  {item.name}
                </p>
              </Link>
              <p className="text-sm px-4">
                {item.OrderService.quantity} x U$D
                {item.OrderService.purchasedPrice}
              </p>
              {review ? (
                <p className="text-sm px-4">Raiting: {review.score} / 5</p>
              ) : (
                <p className="text-sm px-4">This item has no review</p>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
