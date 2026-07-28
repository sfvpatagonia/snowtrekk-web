import { useState, useEffect, useRef } from "react";
import styles from "./notificationButton.module.css";
import { Notifications } from "@mui/icons-material";
import { Badge, Menu } from "@mui/material";
import { io } from "socket.io-client";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";

export default function NotificationButton() {
  const socketRef = useRef(null);
  const [unreadShopMessages, setUnreadShopMessages] = useState([]);
  const [unreadUserMessages, setUnreadUserMessages] = useState([]);
  const [open, setOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);

  const user = useSelector((state) => state.user);

  useEffect(() => {
    const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:1337/api";
    if (!user?.token) return;

    const URL = apiUrl.replace("/api", "");
    socketRef.current = io(URL, {
      auth: {
        token: user.token, // authSocket leerÃ¡ este token
      },
    });

    const socket = socketRef.current;

    socket.on("unreadTotals", ({ shopChat = [], userChat = [] }) => {
      const totalAsUser = shopChat.reduce(
        (acc, r) => acc + Number(r.unread || 0),
        0,
      );
      const totalAsShop = userChat.reduce(
        (acc, r) => acc + Number(r.unread || 0),
        0,
      );

      setUnreadUserMessages(userChat);
      setUnreadShopMessages(shopChat);
    });
  }, [user.token]);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
    setOpen(true);
  };
  const handleClose = () => {
    setAnchorEl(null);
    setOpen(false);
  };

  return (
    <div>
      <Badge
        badgeContent={unreadUserMessages.length + unreadShopMessages.length}
        color="primary"
      ></Badge>
      <Notifications className={styles.link} onClick={handleClick} />
      <Menu
        id="NotificationMenu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        slotProps={{
          list: {
            "aria-labelledby": "basic-button",
          },
        }}
      >
        {unreadShopMessages.length > 0 && (
          <div className={styles.item}>
            <h3 className={styles.title}>Shop Messages</h3>
            <ul className={styles.list}>
              {unreadShopMessages.map((chat) => (
                <li key={chat.orderId} className={styles.itemList}>
                  <Link
                    to={`/shop/${chat.shopId}/chat/${chat.orderNumber}`}
                    className={styles.linkContainer}
                  >
                    <p className={styles.name}>{chat.shopName}</p>
                    <p className={styles.unread}> {chat.unread}</p>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        )}
        {unreadUserMessages.length > 0 && (
          <div className={styles.item}>
            <h3 className={styles.title}>User Messages</h3>
            <ul className={styles.list}>
              {unreadUserMessages.map((chat) => (
                <li key={chat.orderId} className={styles.itemList}>
                  <Link
                    to={`/user/${chat.userId}/chat/${chat.orderNumber}`}
                    className={styles.linkContainer}
                  >
                    <p className={styles.name}>{chat.userName}</p>
                    <p className={styles.unread}>{chat.unread}</p>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        )}
      </Menu>
    </div>
  );
}

