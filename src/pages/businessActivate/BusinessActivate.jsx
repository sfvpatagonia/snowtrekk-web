import { useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import Header from "@/components/header/Header";
import Footer from "@/components/footer/Footer";
import { TextField } from "@mui/material";
import userService from "@/services/user";

function BusinessActivate() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");
  const navigate = useNavigate();

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [activated, setActivated] = useState(false);

  const onSubmit = async (e) => {
    e.preventDefault();

    if (!token) {
      setError("Invalid activation link");
      return;
    }
    if (password.length < 6) {
      setError("Password must have at least 6 characters");
      return;
    }
    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    setLoading(true);
    try {
      const response = await userService.activateAccount(token, password);
      if (response.ok) {
        setActivated(true);
      } else {
        setError(response.message || "Could not activate the account");
      }
    } catch (err) {
      console.error(err);
      setError("Could not activate the account");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Header />
      <div className="flex flex-col items-center justify-start shadow bg-[url('/fondoLogin.jpg')] h-[100vh] bg-cover bg-center text-main-0 dark:text-main-1000">
        <div className="flex flex-col rounded bg-main-50 dark:bg-main-950 mt-8 px-8 justify-center items-center py-3 shadow-xl max-w-md w-full">
          <h1 className="text-2xl font-bold my-4 text-center">
            Activá tu cuenta de negocio
          </h1>

          {activated ? (
            <div className="flex flex-col items-center gap-4 py-8 text-center">
              <p>Tu cuenta fue activada correctamente.</p>
              <Link to="/business/login" className="button">
                Ir al login de negocios
              </Link>
            </div>
          ) : (
            <form onSubmit={onSubmit} className="flex flex-col gap-2 p-4 w-full">
              <TextField
                label="Nueva contraseña"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={loading}
              />
              <TextField
                label="Confirmar contraseña"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                disabled={loading}
              />
              <p className="text-red-600 dark:text-red-400">{error}</p>

              <button className="button" disabled={loading}>
                {loading ? "Activando..." : "Activar cuenta"}
              </button>
            </form>
          )}
        </div>
      </div>
      <Footer />
    </>
  );
}

export default BusinessActivate;
