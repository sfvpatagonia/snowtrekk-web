import { useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { addUser } from "@/redux/userSlice";

const apiUrl = import.meta.env.VITE_API_URL;

export default function ConfirmProfileEdit() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const token = searchParams.get("token");
  // confirm | verifying | success | error
  const [status, setStatus] = useState(token ? "confirm" : "error");

  const handleConfirm = async () => {
    setStatus("verifying");

    try {
      const res = await fetch(`${apiUrl}/user/confirm-profile-edit`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ token }),
      });
      const data = await res.json();

      if (!data.ok) {
        setStatus("error");
        return;
      }

      dispatch(addUser(data.body.updatedUser));
      setStatus("success");

      setTimeout(() => navigate("/my-profile"), 2000);
    } catch {
      setStatus("error");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-[url('/fondoLogin.jpg')] bg-cover bg-center">
      <div className="bg-white dark:bg-[#333] rounded-lg shadow-xl px-10 py-12 flex flex-col items-center gap-4 max-w-sm w-full mx-4 text-center">
        {status === "confirm" && (
          <>
            <span className="text-5xl">✏️</span>
            <h1 className="text-xl font-bold dark:text-white">Confirmá los cambios en tu perfil</h1>
            <p className="text-gray-500 dark:text-gray-300 text-sm">
              Hacé clic para aplicar los cambios que pediste en tu información personal.
            </p>
            <button className="button mt-2" onClick={handleConfirm}>
              Confirmar cambios
            </button>
          </>
        )}
        {status === "verifying" && (
          <>
            <div className="w-10 h-10 border-4 border-[var(--color-500)] border-t-transparent rounded-full animate-spin" />
            <p className="font-semibold text-lg dark:text-white">Aplicando los cambios...</p>
          </>
        )}
        {status === "success" && (
          <>
            <span className="text-5xl">✅</span>
            <h1 className="text-2xl font-black text-[var(--color-600)] dark:text-[var(--color-400)]">
              ¡Perfil actualizado!
            </h1>
            <p className="text-gray-500 dark:text-gray-300">Redirigiendo...</p>
          </>
        )}
        {status === "error" && (
          <>
            <span className="text-5xl">❄️</span>
            <h1 className="text-xl font-bold dark:text-white">Link inválido o expirado</h1>
            <p className="text-gray-500 dark:text-gray-300 text-sm">
              El link de confirmación ya fue usado o expiró. Volvé a tu perfil para intentar de nuevo.
            </p>
            <a href="/my-profile" className="button mt-2">
              Ir a mi perfil
            </a>
          </>
        )}
      </div>
    </div>
  );
}
