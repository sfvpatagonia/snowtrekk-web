import ChatIcon from "@mui/icons-material/Chat";
import { Tooltip } from "@mui/material";
import VisibilityIcon from "@mui/icons-material/Visibility";

export default function OrdersMobileCards({
  orders,
  handleOpenModal,
  navigate,
}) {
  return (
    <div className="grid gap-4 lg:hidden">
      {orders.map((order) => (
        <div
          key={order.id}
          className="bg-main-100 dark:bg-main-900 rounded-lg shadow p-4 flex flex-col gap-2"
        >
          <div className="flex justify-between items-center">
            <p className="font-semibold text-blue-600 dark:text-cyan-400">
              #{order.orderNumber}
            </p>
            <span className="text-main-0 dark:text-main-1000 text-sm font-semibold">
              ${order.orderTotal.toFixed(2)}
            </span>
          </div>

          <div className="overflow-hidden rounded-lg border border-main-50 dark:border-main-950">
            <table className="w-full text-sm text-main-0 dark:text-main-1000">
              <tbody>
                <tr className="border-b border-main-50 dark:border-main-950">
                  <td className="py-1 px-2 font-semibold w-1/2 bg-main-50 dark:bg-main-950">
                    Client
                  </td>
                  <td className="py-1 px-2">
                    {order.user
                      ? `${order.user.name} ${order.user.lastName}`
                      : "N/A"}
                  </td>
                </tr>
                <tr className="border-b border-main-50 dark:border-main-950">
                  <td className="py-1 px-2 font-semibold bg-main-50 dark:bg-main-950">
                    Date
                  </td>
                  <td className="py-1 px-2">
                    {new Date(order.createdAt).toLocaleDateString()}
                  </td>
                </tr>
                <tr>
                  <td className="py-1 px-2 font-semibold bg-main-50 dark:bg-main-950">
                    Status
                  </td>
                  <td className="py-1 px-2">{order.status}</td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className="flex justify-end gap-3 pt-2 border-t border-gray-300 dark:border-gray-700">
            <Tooltip title="View Order">
              <VisibilityIcon
                onClick={() => handleOpenModal(order)}
                className="text-blue-500 cursor-pointer"
              />
            </Tooltip>

            <Tooltip title="Chat with Client">
              <ChatIcon
                onClick={() =>
                  navigate(`/user/${order.idUser}/chat/${order.orderNumber}`)
                }
                className="text-green-500 cursor-pointer"
              />
            </Tooltip>
          </div>
        </div>
      ))}
    </div>
  );
}
