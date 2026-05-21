import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import Header from "@/components/header/Header";
import Footer from "@/components/footer/Footer";
import { addUser } from "@/redux/userSlice";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import { TextField } from "@mui/material";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import userService from "../services/user";

function Login() {
  const isAdmin = useSelector((state) => state.user.isAdmin);
  const user = useSelector((state) => state.user);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [showPass, setShowPass] = useState(false);

  const [errors, setErrors] = useState({
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const isEmailValid = (email) => {
    // Expresión regular para validar el formato del email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const onSubmit = async (e) => {
    e.preventDefault();

    if (!formData.email) {
      setErrors((prevErrors) => ({
        ...prevErrors,
        email: "Email is required",
      }));
      return;
    }

    if (!isEmailValid(formData.email)) {
      setErrors((prevErrors) => ({
        ...prevErrors,
        email: "Invalid email format",
      }));
      return;
    }

    if (!formData.password) {
      setErrors((prevErrors) => ({
        ...prevErrors,
        password: "Password is required",
      }));
      return;
    }
    setLoading(true);

    try {
      const response = await userService.logIn(formData);
      if (response.ok) {
        const { token } = response.body;

        const verifyResponse = await userService.verifyTokenRequest(token);
        if (!verifyResponse) {
          console.log("No autenticado");
          setErrors((prevErrors) => ({
            ...prevErrors,
            general: "Authentication failed. Please try again.",
          }));
        } else {
          localStorage.setItem("token", token);
          dispatch(
            addUser({
              id: verifyResponse.body.id,
              name: verifyResponse.body.name,
              email: verifyResponse.body.email,
              isAdmin: verifyResponse.body.isAdmin,
              isSuperAdmin: verifyResponse.body.isSuperAdmin,
              token,
            }),
          );
          if (isAdmin) {
            navigate("/admin");
          } else {
            navigate("/");
          }
        }

        //Redireccion en caso de ser o no admin
      } else {
        const errorMessage =
          response.message || "An error ocurred when trying to log in";
        setErrors((prevErrors) => ({ ...prevErrors, general: errorMessage }));
      }
    } catch (error) {
      console.error(error);
      const errorMessage =
        error.response?.data?.message ||
        "An error ocurred when trying to log in";
      setErrors((prevErrors) => ({ ...prevErrors, general: errorMessage }));
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));

    setErrors((prevErrors) => ({ ...prevErrors, [name]: "" }));
  };

  return (
    <>
      <Header />
      <div className="flex flex-col items-center justify-start shadow bg-[url('/fondoLogin.jpg')] h-[100vh] bg-cover bg-center text-main-0 dark:text-main-1000">
        <div className="flex flex-col rounded bg-main-50 dark:bg-main-950 mt-8 px-8 justify-center items-center py-3 shadow-xl">
          <h1 className="text-2xl font-bold my-4">Login</h1>

          <form onSubmit={onSubmit} className="flex flex-col gap-2 p-4 ">
            <TextField
              label="Write your email"
              name="email"
              placeholder=" youremail@email.com"
              value={formData.email}
              onChange={handleChange}
            />
            <p className="text-red-600 dark:text-red-400">{errors.email}</p>
            <div className="flex">
              <TextField
                label="Password"
                type={showPass ? "text" : "password"}
                name="password"
                placeholder=" Password"
                value={formData.password}
                onChange={handleChange}
              />
              <div
                className="rounded bg-main-50 dark:bg-main-950 h-full aspect-square flex items-center justify-center cursor-pointer hover:bg-main-50/50 hover:dark:bg-main-950/50 duration-300 ease-in hover:text-main-600 hover:dark:text-main-400"
                onClick={() => setShowPass(!showPass)}
              >
                {!showPass ? <VisibilityOffIcon /> : <VisibilityIcon />}
              </div>
            </div>
            <p className="text-red-600 dark:text-red-400">{errors.password}</p>
            <p className="text-red-600 dark:text-red-400">{errors.general}</p>

            <button className="button" disabled={loading}>
              Login
            </button>
          </form>
          {/* <Link to="/forgot-password" className="button text-xs">
            I forgot my password
          </Link> */}
          <p className=" py-4">
            Don't have an account?{" "}
            <Link
              to="/register"
              className="text-green-700 dark:text-green-500 duration-300 ease-in hover:text-main-600 hover:dark:text-main-400"
            >
              Sign up
            </Link>
          </p>
        </div>
      </div>
      <Footer />
    </>
  );
}

export default Login;
