import { Drawer, IconButton } from "@mui/material";
import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import MenuIcon from "@mui/icons-material/Menu";
import { Badge } from "@mui/material";
import { Link } from "react-router-dom";
import { io } from "socket.io-client";
import { changeTheme } from "@/redux/themeSlice";
import defaultAvatar from "@/assets/bonfire.png";

export default function HeaderMobile({ setOpenCart, setOpenGuide }) {
  const socketRef = useRef(null);
  const [unreadShopMessages, setUnreadShopMessages] = useState([]);
  const [unreadUserMessages, setUnreadUserMessages] = useState([]);
  const [menuOpen, setMenuOpen] = useState(false);
  const dispatch = useDispatch();
  const darkMode = useSelector((state) => state.theme.darkMode);

  const [open, setOpen] = useState(false);

  const user = useSelector((state) => state.user);
  const cart = useSelector((state) => state.cart);

  useEffect(() => {
const URL = import.meta.env.VITE_API_URL.replace("/api", "");
    socketRef.current = io(URL, {
      auth: {
        token: user.token, // authSocket leerá este token
      },
    });

    const socket = socketRef.current;

    socket.on("unreadTotals", ({ shopChat = [], userChat = [] }) => {
      setUnreadUserMessages(userChat);
      setUnreadShopMessages(shopChat);
    });
  }, [user.token]);

  const toggleDrawer = (openDrawer) => (event) => {
    if (
      event.type === "keydown" &&
      (event.key === "Tab" || event.key === "Shift")
    ) {
      return;
    }
    setMenuOpen(openDrawer);
  };

  const toggleDarkMode = () => {
    dispatch(changeTheme(!darkMode));
  };

  return (
    <React.Fragment>
      <IconButton edge="start" aria-label="menu" onClick={toggleDrawer(true)}>
        <MenuIcon className="text-main-1000 duration-300 ease-in cursor-pointer relative text-xl hover:text-main-600 dark:hover:text-main-400" />
      </IconButton>
      <Drawer
        anchor="right"
        open={menuOpen}
        onClose={toggleDrawer(false)}
        classes={{
          paper: "mt-[60px] !right-4 !h-auto w-1/2",
        }}
      >
        <div className="flex flex-col gap-4 w.full items-center justify-start rounded-b-xl p-4 bg-main-50 dark:bg-main-950">
          <ul className="text-left w-full">
            <li className="flex gap-2 w-full border-t border-main-600 dark:border-main-400 first:border-0 p-2">
              <Link
                onClick={() => {
                  setOpenGuide(true);
                  setMenuOpen(false);
                }}
                className="text-lg text-main-0 dark:text-main-1000 hover:text-main-600 dark:hover:text-main-400 duration-200 ease-in"
              >
                Search
              </Link>
            </li>
            <li className="flex gap-2 w-full border-t border-main-600 dark:border-main-400 first:border-0 p-2">
              <Link
                to="/news"
                className="text-lg text-main-0 dark:text-main-1000 hover:text-main-600 dark:hover:text-main-400 duration-200 ease-in"
              >
                News
              </Link>
            </li>
            <li className="flex gap-2 w-full border-t border-main-600 dark:border-main-400 first:border-0 p-2">
              {user.id ? (
                <Link
                  to="/my-profile"
                  onClick={() => setMenuOpen(false)}
                  className="flex items-center gap-2 text-lg text-main-0 dark:text-main-1000 hover:text-main-600 dark:hover:text-main-400 duration-200 ease-in"
                >
                  <img
                    src={user.image || defaultAvatar}
                    alt=""
                    className="w-8 h-8 rounded-full object-cover"
                  />
                  {user.name}
                </Link>
              ) : (
                <Link
                  to="/join"
                  onClick={() => setMenuOpen(false)}
                  className="text-lg text-main-0 dark:text-main-1000 hover:text-main-600 dark:hover:text-main-400 duration-200 ease-in"
                >
                  Sumate
                </Link>
              )}
            </li>
            <li className="flex gap-2 w-full border-t border-main-600 dark:border-main-400 first:border-0 p-2">
              <button
                className="text-lg text-main-0 dark:text-main-1000 hover:text-main-600 dark:hover:text-main-400 duration-200 ease-in cursor-pointer"
                onClick={toggleDarkMode}
              >
                Change theme
              </button>
            </li>
            <li className="flex gap-2 w-full border-t border-main-600 dark:border-main-400 first:border-0 p-2">
              <button
                onClick={() => {
                  setOpenCart(true);
                  setMenuOpen(false);
                }}
                className="text-lg text-main-0 dark:text-main-1000 hover:text-main-600 dark:hover:text-main-400 duration-200 ease-in cursor-pointer"
              >
                <Badge
                  badgeContent={
                    cart.totalQuantity > 99 ? "99+" : cart.totalQuantity
                  }
                  color="primary"
                >
                  Cart
                </Badge>
              </button>
            </li>
            {unreadShopMessages.length > 0 && (
              <li className="flex gap-2 w-full border-t border-main-600 dark:border-main-400 first:border-0 p-2">
                <div className="bg-main-100 dark:bg-main-900 p-2 flex flex-col items-center justify-start w-full gap-1">
                  <h3 className="font-bold text-start text-main-0 dark:text-main-100  duration-200">
                    Shop Messages
                  </h3>
                  <ul className="flex flex-col gap-1 w-full">
                    {unreadShopMessages.map((chat) => (
                      <li key={chat.orderId}>
                        <Link
                          to={`/shop/${chat.shopId}/chat/${chat.orderNumber}`}
                          className="flex w-full gap-8 border border-main-600 dark:border-main-400 rounded py-1 px-4 duration-300 ease-in items-center "
                        >
                          <p className="text-green-700 dark:text-green-500 text-sm">
                            {chat.shopName}
                          </p>
                          <p className="text-main-0 dark:text-main-1000 text-sm px-1 bg-main-50 dark:bg-main-950 rounded-full">
                            {chat.unread}
                          </p>
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              </li>
            )}
            {unreadUserMessages.length > 0 && (
              <li className="flex gap-2 w-full border-t border-main-600 dark:border-main-400 first:border-0 p-2">
                <div className="bg-main-100 dark:bg-main-900 p-2 flex flex-col items-center justify-start w-full gap-1">
                  <h3 className="font-bold text-start text-main-0 dark:text-main-100  duration-200">
                    User Messages
                  </h3>
                  <ul className="flex flex-col gap-1 w-full">
                    {unreadUserMessages.map((chat) => (
                      <li key={chat.orderId}>
                        <Link
                          to={`/user/${chat.userId}/chat/${chat.orderNumber}`}
                          className="flex w-full gap-8 border border-main-600 dark:border-main-400 rounded py-1 px-4 duration-300 ease-in items-center "
                        >
                          <p className="text-green-700 dark:text-green-500 text-sm">
                            {chat.userName}
                          </p>
                          <p className="text-main-0 dark:text-main-1000 text-sm px-1 bg-main-50 dark:bg-main-950 rounded-full">
                            {chat.unread}
                          </p>
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              </li>
            )}
          </ul>
        </div>
      </Drawer>
    </React.Fragment>
  );
}
