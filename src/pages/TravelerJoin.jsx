import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import Header from "@/components/header/Header";
import Footer from "@/components/footer/Footer";
import { TextField, Checkbox, FormControlLabel } from "@mui/material";
import userService from "../services/user";
import { useDebouncedCheckEmail } from "@/hooks/useDebouncedCheckEmail";
import { useTrekkerPasswordLogin } from "@/hooks/useTrekkerPasswordLogin";

const isEmailValid = (value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);

function TravelerJoin() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [marketingConsent, setMarketingConsent] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const { recognized, name, verified } = useDebouncedCheckEmail(email);
  const {
    password,
    setPassword,
    submit: submitLogin,
    loading: loginLoading,
    error: loginError,
  } = useTrekkerPasswordLogin(email);

  // A recognized, already-verified Trekker logs in inline here instead of
  // going through the magic-link flow again.
  const isTrekkerLogin = recognized && verified;
  const busy = isTrekkerLogin ? loginLoading : loading;

  const onSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!email || !isEmailValid(email)) {
      setError("Ingresá un email válido");
      return;
    }

    if (isTrekkerLogin) {
      const ok = await submitLogin();
      if (ok) navigate("/explore");
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
              {recognized && (
                <p className="text-sm text-center">
                  {isTrekkerLogin
                    ? `¡Hola de nuevo, ${name}! Para tu seguridad, ingresá tu contraseña.`
                    : "¡Hola de nuevo! Para tu seguridad, te vamos a mandar un link a tu mail."}
                </p>
              )}

              <TextField
                label="Tu email"
                name="email"
                placeholder="youremail@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />

              {isTrekkerLogin ? (
                <TextField
                  label="Contraseña"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={loginLoading}
                />
              ) : (
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={marketingConsent}
                      onChange={(e) => setMarketingConsent(e.target.checked)}
                    />
                  }
                  label="Quiero recibir novedades y ofertas"
                />
              )}

              <p className="text-red-600 dark:text-red-400 text-sm">
                {isTrekkerLogin ? loginError : error}
              </p>

              <button className="button" disabled={busy}>
                {isTrekkerLogin
                  ? busy
                    ? "Ingresando..."
                    : "Ingresar"
                  : busy
                    ? "Enviando..."
                    : "Enviarme el link"}
              </button>
            </form>
          )}
        </div>
      </div>
      <Footer />
    </>
  );
}

export default TravelerJoin;
