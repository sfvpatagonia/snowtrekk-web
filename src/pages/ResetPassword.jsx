import { useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import PasswordField from "@/components/PasswordField/PasswordField";
import userService from "@/services/user";

export default function ResetPassword() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const token = searchParams.get("token");
  // form | submitting | success | error
  const [status, setStatus] = useState(token ? "form" : "error");
  const [newPassword, setNewPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setStatus("submitting");

    try {
      const response = await userService.resetPassword(token, newPassword);
      if (!response.ok) {
        setError(response.message || "No pudimos restablecer tu contraseña");
        setStatus("form");
        return;
      }

      setStatus("success");
      setTimeout(() => navigate("/traveler/login"), 2000);
    } catch {
      setError("Ocurrió un error, intentá de nuevo");
      setStatus("form");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-[url('/fondoLogin.jpg')] bg-cover bg-center">
      <div className="bg-white dark:bg-[#333] rounded-lg shadow-xl px-10 py-12 flex flex-col items-center gap-4 max-w-sm w-full mx-4 text-center">
        {status === "form" && (
          <>
            <span className="text-5xl">🔑</span>
            <h1 className="text-xl font-bold dark:text-white">Elegí tu nueva contraseña</h1>
            <form onSubmit={handleSubmit} className="flex flex-col gap-2 w-full">
              <PasswordField
                label="Nueva contraseña"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                helperText="Mínimo 8 caracteres, 1 mayúscula y 1 número"
              />
              {error && <p className="text-red-600 dark:text-red-400 text-sm">{error}</p>}
              <button className="button mt-2" type="submit">
                Guardar contraseña
              </button>
            </form>
          </>
        )}
        {status === "submitting" && (
          <>
            <div className="w-10 h-10 border-4 border-[var(--color-500)] border-t-transparent rounded-full animate-spin" />
            <p className="font-semibold text-lg dark:text-white">Guardando...</p>
          </>
        )}
        {status === "success" && (
          <>
            <span className="text-5xl">✅</span>
            <h1 className="text-2xl font-black text-[var(--color-600)] dark:text-[var(--color-400)]">
              ¡Contraseña actualizada!
            </h1>
            <p className="text-gray-500 dark:text-gray-300">Redirigiendo...</p>
          </>
        )}
        {status === "error" && (
          <>
            <span className="text-5xl">❄️</span>
            <h1 className="text-xl font-bold dark:text-white">Link inválido o expirado</h1>
            <p className="text-gray-500 dark:text-gray-300 text-sm">
              El link para restablecer tu contraseña ya fue usado o expiró.
            </p>
            <a href="/forgot-password" className="button mt-2">
              Solicitar nuevo link
            </a>
          </>
        )}
      </div>
    </div>
  );
}
