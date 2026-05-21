import { Drawer, Tooltip } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import CloseIcon from "@mui/icons-material/Close";
import { clearCart, removeFromCart } from "@/redux/cartSlice";
import { Link } from "react-router-dom";

export default function CartDrawer({ open, setOpen }) {
  const cart = useSelector((state) => state.cart);
  const dispatch = useDispatch();

  return (
    <Drawer
      anchor="right"
      open={open}
      onClose={() => setOpen(false)}
      PaperProps={{ sx: { width: "350px" } }}
    >
      <div className="flex flex-col gap-4 py-8 px-4 h-full">
        <h3 className="text-main-0 dark:text-main-1000 text-lg w-full text-left">
          Your cart
        </h3>
        <ul className="flex flex-col w-full h-full overflow-hidden gap-2 items-start justify-start bg-main-100 dark:bg-main-900 rounded-lg p-1">
          {cart.cartItems.map((item, index) => (
            <div
              key={index}
              className="flex w-full bg-main-50 dark:bg-main-950 rounded border border-main-600 dark:border-main-400 overflow-hidden"
            >
              <img
                src={item.image.url}
                alt={item.name}
                className="aspect-square h-19 object-cover"
              />
              <div className="w-full px-1">
                <h3 className="font-bold text-sm overflow-hidden text-ellipsis text-main-600 dark:text-main-400 max-w-[200px] whitespace-nowrap">
                  {item.name}
                </h3>
                <div className="flex text-xs text-ellipsis whitespace-nowrap font-bold py-1 overflow-hidden justify-between max-w-full">
                  <p>{item.date.date}</p>
                  <p>{item.date.time}</p>
                </div>
                <div className="flex text-xs text-ellipsis whitespace-nowrap font-bold py-1 overflow-hidden justify-between max-w-full">
                  <p>${item.price}</p>
                  <p>x {item.cartQuantity}</p>
                  <p>Total: ${item.price * item.cartQuantity}</p>
                </div>
              </div>
              <Tooltip title="Remove from cart">
                <div
                  className="cursor-pointer duration-500 hover:text-red-600 ease-in"
                  onClick={() => dispatch(removeFromCart(item))}
                >
                  <CloseIcon />
                </div>
              </Tooltip>
            </div>
          ))}
        </ul>
        <div className="flex justify-center items-center px-4 gap-4">
          <p className="font-bold ">Total: ${cart.totalAmount}</p>
          {cart.cartItems.length > 0 && (
            <Link to="/checkout">
              <button className="button">Checkout</button>
            </Link>
          )}
        </div>
        <div className="flex px-4 justify-end">
          <button className="button" onClick={() => dispatch(clearCart())}>
            Clear Cart
          </button>
        </div>
      </div>
    </Drawer>
  );
}
