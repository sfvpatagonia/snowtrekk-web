import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Header from "@/components/header/Header";
import Footer from "@/components/footer/Footer";
import { TextField } from "@mui/material";
import PasswordField from "@/components/PasswordField/PasswordField";
import { useTrekkerPasswordLogin } from "@/hooks/useTrekkerPasswordLogin";

function TrekkerLogin() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const { password, setPassword, submit, loading, error } = useTrekkerPasswordLogin(email);

  const onSubmit = async (e) => {
    e.preventDefault();
    const ok = await submit();
    if (ok) navigate("/explore");
  };

  return (
    <>
      <Header />
      <div className="flex flex-col items-center justify-start shadow bg-[url('/fondoLogin.jpg')] h-[100vh] bg-cover bg-center text-main-0 dark:text-main-1000">
        <div className="flex flex-col rounded bg-main-50 dark:bg-main-950 mt-8 px-8 justify-center items-center py-3 shadow-xl">
          <h1 className="text-2xl font-bold my-4">Ingresar</h1>

          <form onSubmit={onSubmit} className="flex flex-col gap-2 p-4">
            <TextField
              label="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={loading}
            />
            <PasswordField
              label="Contraseña"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={loading}
            />
            <p className="text-red-600 dark:text-red-400">{error}</p>

            <button className="button" disabled={loading}>
              {loading ? "Ingresando..." : "Ingresar"}
            </button>
          </form>

          <p className="py-2 text-sm">
            ¿No tenés cuenta todavía?{" "}
            <Link to="/join" className="text-green-700 dark:text-green-500">
              Sumate a Snowtrekk
            </Link>
          </p>
          <p className="pb-4 text-sm">
            <Link to="/forgot-password" className="text-green-700 dark:text-green-500">
              ¿Olvidaste tu contraseña?
            </Link>
          </p>
        </div>
      </div>
      <Footer />
    </>
  );
}

export default TrekkerLogin;
