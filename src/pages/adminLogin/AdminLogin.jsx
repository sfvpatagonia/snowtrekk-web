import { useNavigate } from "react-router-dom";
import { useState } from "react";
import Header from "@/components/header/Header";
import Footer from "@/components/footer/Footer";
import { addUser } from "@/redux/userSlice";
import { useDispatch } from "react-redux";
import { TextField } from "@mui/material";
import userService from "../../services/user";

function AdminLogin() {
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

      const { token } = response.body;
      const verifyResponse = await userService.verifyTokenRequest(token);

      if (!verifyResponse || verifyResponse.body?.role !== "admin") {
        setErrors({ general: "This account does not have admin access" });
        return;
      }

      localStorage.setItem("token", token);
      dispatch(
        addUser({
          id: verifyResponse.body.id,
          name: verifyResponse.body.name,
          email: verifyResponse.body.email,
          isAdmin: verifyResponse.body.isAdmin,
          isSuperAdmin: verifyResponse.body.isSuperAdmin,
          role: verifyResponse.body.role,
          token,
        }),
      );
      navigate("/admin");
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
          <h1 className="text-2xl font-bold my-4">Admin Login</h1>

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
        </div>
      </div>
      <Footer />
    </>
  );
}

export default AdminLogin;
