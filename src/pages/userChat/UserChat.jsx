import { Link, useParams } from "react-router-dom";
import Footer from "@/components/footer/Footer";
import Header from "@/components/header/Header";
import { useEffect, useRef, useState } from "react";
import Chat from "./components/Chat";
import InputMessage from "./components/InputMessage";
import ChatHeader from "./components/ChatHeader";
import ListItems from "./components/ListItems";
import { West } from "@mui/icons-material";
import { useSelector } from "react-redux";
import order from "@/services/order";
import LoadingComponent from "@/components/LoadingComponent";
import { io } from "socket.io-client";

export default function UserChat() {
  const { idOrder } = useParams();
  const user = useSelector((state) => state.user);

  const socketRef = useRef(null);
  const [currentOrder, setCurrentOrder] = useState(null);
  const [chats, setChats] = useState([]);
  const [loading, setLoading] = useState(true);

  /* ───────────────── Obtener datos de la orden ───────────────── */
  useEffect(() => {
    if (!user?.token) return;
    const URL = import.meta.env.VITE_API_URL.replace("/api", "");
    console.log("Connecting to socket with URL:", URL);

    order
      .getOrderByOrderNumber(idOrder, user.token)
      .then((data) => {
        if (data.ok) setCurrentOrder(data.body.order);

        return data.body.order;
      })
      .then((order) => {
        // Conectar al socket una vez que tenemos la ordenif (socketRef.current) socketRef.current.disconnect();

        socketRef.current = io(URL, {
          auth: {
            token: user.token, // authSocket leerá este token
          },
        });

        const socket = socketRef.current;

        /* 1 · Esperamos a que la conexión esté realmente abierta */
        socket.on("connect", () => {
          socket.emit("joinOrderRoom", { orderId: order.id });
        });

        /* 2 · Historial completo */
        socket.on("chatHistory", (history) => {
          //console.log("[Socket] chatHistory:", history);
          setChats(history);
          // Marcamos como leído cuando abrimos la sala
          socket.emit("markRead", { orderId: order.id, senderType: "shop" });
        });

        /* 3 · Mensaje nuevo */
        socket.on("message", (msg) => {
          setChats((prev) => [...prev, msg]);
        });

        /* 4 · Debug errores */
        socket.on("error", (err) => {
          console.error("[Socket] error:", err);
        });

        /* Limpieza al desmontar */
        return () => {
          socket.disconnect();
        };
      })
      .finally(() => setLoading(false));

    // Evitamos múltiples conexiones
  }, [idOrder, user?.token]);

  /* ─────────────── Configurar Socket una vez cargada la orden ─────────────── */
  useEffect(() => {
    if (!idOrder || !user?.token) return;
  }, [user?.token]);

  /* ─────────────── Función para enviar mensaje ─────────────── */
  const sendMessage = (text) => {
    const socket = socketRef.current;
    if (!text.trim() || !socket || !currentOrder) return;

    const msg = {
      orderId: currentOrder.id,
      content: text.trim(),
      senderType: "shop", // Asumiendo que el user envía el mensaje
    };

    socket.emit("message", msg);

    // Optimistic UI
    // setChats((prev) => [
    //   ...prev,
    //   {
    //     ...msg,
    //     senderType: "user",
    //     createdAt: new Date().toISOString(),
    //   },
    // ]);
  };

  if (loading) return <LoadingComponent />;

  return (
    <div>
      <Header />
      <div className="flex flex-col p-4 bg-main-100 dark:bg-main-900 min-h-[calc(100vh-64px)] items-center ">
        <div className="fllex w-full max-w-7xl py-4">
          <Link
            to="/my-shop?tab=sales"
            className="flex items-center gap-1 underline text-green-700 dark:text-green-500 self-start"
          >
            <West fontSize="small" />{" "}
            <p className="underline hover:text-main-600 dark:hover:text-main-400 duration-400 ease-in">
              Back to my shop
            </p>
          </Link>
        </div>

        <ChatHeader order={currentOrder} />

        <div className="flex w-full flex-col sm:flex-row max-w-7xl">
          <div className="flex flex-col w-full border-b sm:border-r sm:border-b-0 border-main-600 dark:border-main-400 shadow">
            <Chat chats={chats} />
            <InputMessage onSend={sendMessage} />
          </div>

          <ListItems
            items={[
              ...(currentOrder?.products || []),
              ...(currentOrder?.services || []),
            ]}
          />
        </div>
      </div>
      <Footer />
    </div>
  );
}
