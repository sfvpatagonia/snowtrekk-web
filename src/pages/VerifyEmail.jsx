import { useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { addUser } from "@/redux/userSlice";
import userService from "../services/user";

const apiUrl = import.meta.env.VITE_API_URL;

export default function VerifyEmail() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const token = searchParams.get("token");
  // confirm | verifying | success | error | expired_resent
  const [status, setStatus] = useState(token ? "confirm" : "error");

  const handleConfirm = async () => {
    setStatus("verifying");

    try {
      const res = await fetch(`${apiUrl}/user/verify-magic-link`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ token }),
      });
      const data = await res.json();

      if (!data.ok) {
        setStatus(data.message === "expired_resent" ? "expired_resent" : "error");
        return;
      }

      const me = await userService.getMe();
      if (!me.ok) {
        setStatus("error");
        return;
      }

      dispatch(addUser(me.body));
      setStatus("success");

      setTimeout(() => navigate("/explore"), 2000);
    } catch {
      setStatus("error");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-[url('/fondoLogin.jpg')] bg-cover bg-center">
      <div className="bg-white dark:bg-[#333] rounded-lg shadow-xl px-10 py-12 flex flex-col items-center gap-4 max-w-sm w-full mx-4 text-center">
        {status === "confirm" && (
          <>
            <span className="text-5xl">⛷️</span>
            <h1 className="text-xl font-bold dark:text-white">Confirmá tu cuenta</h1>
            <p className="text-gray-500 dark:text-gray-300 text-sm">
              Hacé clic para activar tu cuenta de Snowtrekk.
            </p>
            <button className="button mt-2" onClick={handleConfirm}>
              Confirmar mi cuenta
            </button>
          </>
        )}
        {status === "verifying" && (
          <>
            <div className="w-10 h-10 border-4 border-[var(--color-500)] border-t-transparent rounded-full animate-spin" />
            <p className="font-semibold text-lg dark:text-white">Verificando tu link...</p>
          </>
        )}
        {status === "success" && (
          <>
            <span className="text-5xl">⛷️</span>
            <h1 className="text-2xl font-black text-[var(--color-600)] dark:text-[var(--color-400)]">
              ¡Bienvenido a Snowtrekk!
            </h1>
            <p className="text-gray-500 dark:text-gray-300">Redirigiendo...</p>
          </>
        )}
        {status === "expired_resent" && (
          <>
            <span className="text-5xl">📧</span>
            <h1 className="text-xl font-bold dark:text-white">Tu link venció</h1>
            <p className="text-gray-500 dark:text-gray-300 text-sm">
              Pero ya te mandamos uno nuevo — revisá tu email de nuevo.
            </p>
          </>
        )}
        {status === "error" && (
          <>
            <span className="text-5xl">❄️</span>
            <h1 className="text-xl font-bold dark:text-white">Link inválido o expirado</h1>
            <p className="text-gray-500 dark:text-gray-300 text-sm">
              El link de acceso ya fue usado o expiró. Podés solicitar uno nuevo.
            </p>
            <a href="/join" className="button mt-2">
              Solicitar nuevo link
            </a>
          </>
        )}
      </div>
    </div>
  );
}
