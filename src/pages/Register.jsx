import { useState } from "react";
import { Link } from "react-router-dom";
import Header from "@/components/header/Header";
import Footer from "@/components/footer/Footer";
import { TextField } from "@mui/material";

const apiUrl = import.meta.env.VITE_API_URL;

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function Register() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const onSubmit = async (e) => {
    e.preventDefault();
    if (!EMAIL_RE.test(email.trim())) {
      setError("Ingresá un email válido");
      return;
    }

    setError("");
    setLoading(true);
    try {
      const res = await fetch(`${apiUrl}/user/pre-register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim() }),
      });
      if (res.ok) {
        setSent(true);
      } else {
        setError("Ocurrió un error. Intentá de nuevo.");
      }
    } catch {
      setError("No se pudo conectar. Intentá de nuevo.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Header />
      <div className="flex flex-col items-center justify-center min-h-screen bg-[url('/fondoLogin.jpg')] bg-cover bg-center text-main-0 dark:text-main-1000 px-4">
        <div className="flex flex-col rounded-lg bg-main-50 dark:bg-main-950 mt-8 px-8 py-10 shadow-xl items-center w-full max-w-sm gap-4">

          {sent ? (
            <>
              <span className="text-5xl">📬</span>
              <h1 className="text-2xl font-black text-center">¡Revisá tu email!</h1>
              <p className="text-center text-gray-500 dark:text-gray-300 text-sm">
                Te enviamos un link de acceso a <strong>{email}</strong>.
                <br />Hacé clic en el link para activar tu cuenta.
              </p>
              <p className="text-xs text-gray-400 mt-2">¿No lo ves? Revisá spam.</p>
            </>
          ) : (
            <>
              <h1 className="text-2xl font-black">Empezar gratis</h1>
              <p className="text-sm text-gray-500 dark:text-gray-300 text-center">
                Solo necesitamos tu email. Sin formularios largos.
              </p>
              <form onSubmit={onSubmit} className="flex flex-col gap-3 w-full">
                <TextField
                  type="email"
                  label="Tu email"
                  placeholder="tu@email.com"
                  value={email}
                  onChange={(e) => { setEmail(e.target.value); setError(""); }}
                  disabled={loading}
                  fullWidth
                  autoFocus
                />
                {error && <p className="text-red-500 text-sm">{error}</p>}
                <button className="button w-full py-3 text-base" disabled={loading}>
                  {loading ? "Enviando..." : "Continuar →"}
                </button>
              </form>
              <p className="text-sm flex gap-1 text-gray-500 dark:text-gray-300">
                ¿Ya tenés cuenta?
                <Link to="/login" className="text-green-600 dark:text-green-400 font-semibold">
                  Iniciar sesión
                </Link>
              </p>
            </>
          )}
        </div>
      </div>
      <Footer />
    </>
  );
}

export default Register;
