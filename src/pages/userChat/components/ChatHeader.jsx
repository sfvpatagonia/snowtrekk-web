import { formatDateMMMMdYYYY } from "@/utils/dateParser";
import giveDefaultImage from "@/utils/profileshoppic";
import { Link } from "react-router-dom";

export default function ChatHeader({ order }) {
  return (
    <div className="flex w-full max-w-7xl rounded-t bg-main-50 dark:bg-main-950 border-b border-main-400 dark:border-main-600 gap-4 p-2 text-main-0 dark:text-main-1000">
      <div className="flex justify-center items-center h-full rounded-sm bg-main-100 dark:bg-main-900">
        <img
          src={order.user.Image ? order.user.Image.url : giveDefaultImage(1)}
          alt="User"
          className="max-h-[75px] aspect-square object-contain p-1 "
        />
      </div>
      <div className="flex flex-col w-full">
        <div className="flex justify-between items-baseline w-full">
          <Link to={`/user/${order.user.id}`}>
            <h1 className="hover:text-green-700 dark:hover:text-green-500 duration-300 ease-in hover:underline">
              {order.user?.name}
            </h1>
          </Link>
          <p className="text-sm">Order N°: {order?.orderNumber}</p>
        </div>
        <div className="flex flex-col text-left self-start">
          <p className="text-sm">
            Date: {formatDateMMMMdYYYY(order?.createdAt)}
          </p>
          <p className="text-sm">E-mail: {order.user?.email}</p>
        </div>
      </div>
    </div>
  );
}
