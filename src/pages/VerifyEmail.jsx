import { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { addUser } from "@/redux/userSlice";

const apiUrl = import.meta.env.VITE_API_URL;

export default function VerifyEmail() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [status, setStatus] = useState("verifying"); // verifying | success | error

  useEffect(() => {
    const token = searchParams.get("token");
    if (!token) {
      setStatus("error");
      return;
    }

    fetch(`${apiUrl}/user/verify-magic-link`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (!data.ok) {
          setStatus("error");
          return;
        }

        sessionStorage.setItem("token", data.body.token);
        dispatch(addUser({ token: data.body.token }));
        setStatus("success");

        setTimeout(() => navigate("/"), 2000);
      })
      .catch(() => setStatus("error"));
  }, []);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-[url('/fondoLogin.jpg')] bg-cover bg-center">
      <div className="bg-white dark:bg-[#333] rounded-lg shadow-xl px-10 py-12 flex flex-col items-center gap-4 max-w-sm w-full mx-4 text-center">
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
        {status === "error" && (
          <>
            <span className="text-5xl">❄️</span>
            <h1 className="text-xl font-bold dark:text-white">Link inválido o expirado</h1>
            <p className="text-gray-500 dark:text-gray-300 text-sm">
              El link de acceso ya fue usado o expiró. Podés solicitar uno nuevo.
            </p>
            <a href="/register" className="button mt-2">
              Solicitar nuevo link
            </a>
          </>
        )}
      </div>
    </div>
  );
}
