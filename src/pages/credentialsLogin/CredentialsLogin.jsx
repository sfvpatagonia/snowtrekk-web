import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import Header from "@/components/header/Header";
import Footer from "@/components/footer/Footer";
import { addUser } from "@/redux/userSlice";
import { useDispatch } from "react-redux";
import { TextField } from "@mui/material";
import userService from "@/services/user";

const ROLE_CONFIG = {
  admin: {
    heading: "Admin Login",
    redirectTo: "/admin",
    mismatchMessage: "This account does not have admin access",
  },
  business: {
    heading: "Business Login",
    redirectTo: "/business/dashboard",
    mismatchMessage: "This account is not a business account",
  },
};

function CredentialsLogin({ allowedRole }) {
  const { heading, redirectTo, mismatchMessage } = ROLE_CONFIG[allowedRole];
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const onSubmit = async (e) => {
    e.preventDefault();
    if (!formData.email || !formData.password) {
      setErrors({ general: "Email and password are required" });
      return;
    }

    setLoading(true);
    try {
      const response = await userService.logIn(formData);
      if (!response.ok) {
        setErrors({ general: response.message || "Invalid credentials" });
        return;
      }

      const me = await userService.getMe();

      if (!me.ok || me.body?.role !== allowedRole) {
        setErrors({ general: mismatchMessage });
        return;
      }

      dispatch(addUser(me.body));
      navigate(redirectTo);
    } catch (error) {
      console.error(error);
      setErrors({ general: "An error occurred when trying to log in" });
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: "", general: "" }));
  };

  return (
    <>
      <Header />
      <div className="flex flex-col items-center justify-start shadow bg-[url('/fondoLogin.jpg')] h-[100vh] bg-cover bg-center text-main-0 dark:text-main-1000">
        <div className="flex flex-col rounded bg-main-50 dark:bg-main-950 mt-8 px-8 justify-center items-center py-3 shadow-xl">
          <h1 className="text-2xl font-bold my-4">{heading}</h1>

          <form onSubmit={onSubmit} className="flex flex-col gap-2 p-4">
            <TextField
              label="Email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              disabled={loading}
            />
            <TextField
              label="Password"
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              disabled={loading}
            />
            <p className="text-red-600 dark:text-red-400">{errors.general}</p>

            <button className="button" disabled={loading}>
              Login
            </button>
          </form>

          {allowedRole === "business" && (
            <p className="py-4 text-sm">
              ¿Todavía no activaste tu cuenta?{" "}
              <Link
                to="/stores/register"
                className="text-green-700 dark:text-green-500"
              >
                Registrá tu negocio
              </Link>
            </p>
          )}
        </div>
      </div>
      <Footer />
    </>
  );
}

export default CredentialsLogin;
