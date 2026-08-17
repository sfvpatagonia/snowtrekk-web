import { useState } from "react";
import { useSearchParams, Link } from "react-router-dom";
import Header from "@/components/header/Header";
import Footer from "@/components/footer/Footer";
import { TextField, Checkbox, FormControlLabel } from "@mui/material";
import userService from "../services/user";

function TravelerJoin() {
  const [searchParams] = useSearchParams();
  const [email, setEmail] = useState("");
  const [marketingConsent, setMarketingConsent] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const isEmailValid = (value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);

  const onSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!email || !isEmailValid(email)) {
      setError("Ingresá un email válido");
      return;
    }

    setLoading(true);
    try {
      const response = await userService.preRegister({
        email,
        marketingConsent,
        utmSource: searchParams.get("utm_source") || undefined,
        utmMedium: searchParams.get("utm_medium") || undefined,
        utmCampaign: searchParams.get("utm_campaign") || undefined,
      });

      if (response.ok) {
        setSent(true);
      } else {
        setError(response.message || "Ocurrió un error, intentá de nuevo");
      }
    } catch (err) {
      console.error(err);
      setError("Ocurrió un error, intentá de nuevo");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Header />
      <div className="flex flex-col items-center justify-start shadow bg-[url('/fondoLogin.jpg')] h-[100vh] bg-cover bg-center text-main-0 dark:text-main-1000">
        <div className="flex flex-col rounded bg-main-50 dark:bg-main-950 mt-8 px-8 justify-center items-center py-3 shadow-xl max-w-sm w-full mx-4">
          <h1 className="text-2xl font-bold my-4 text-center">
            Sumate a Snowtrekk
          </h1>

          {sent ? (
            <div className="flex flex-col items-center gap-3 py-6 text-center">
              <span className="text-5xl">📧</span>
              <p className="font-semibold">Revisá tu email</p>
              <p className="text-sm text-gray-500 dark:text-gray-300">
                Te mandamos un link para entrar a tu cuenta. Expira en 24 horas.
              </p>
            </div>
          ) : (
            <form onSubmit={onSubmit} className="flex flex-col gap-2 p-4 w-full">
              <TextField
                label="Tu email"
                name="email"
                placeholder="youremail@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <p className="text-red-600 dark:text-red-400 text-sm">{error}</p>

              <FormControlLabel
                control={
                  <Checkbox
                    checked={marketingConsent}
                    onChange={(e) => setMarketingConsent(e.target.checked)}
                  />
                }
                label="Quiero recibir novedades y ofertas"
              />

              <button className="button" disabled={loading}>
                {loading ? "Enviando..." : "Enviarme el link"}
              </button>
            </form>
          )}

          <p className="py-4">
            ¿Ya tenés cuenta?{" "}
            <Link
              to="/login"
              className="text-green-700 dark:text-green-500 duration-300 ease-in hover:text-main-600 hover:dark:text-main-400"
            >
              Iniciar sesión
            </Link>
          </p>
        </div>
      </div>
      <Footer />
    </>
  );
}

export default TravelerJoin;
