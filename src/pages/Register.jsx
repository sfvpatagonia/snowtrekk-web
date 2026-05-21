import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import Header from "@/components/header/Header";
import Footer from "@/components/footer/Footer";
import swal from "sweetalert";
import { TextField } from "@mui/material";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
//backend url
const apiUrl = import.meta.env.VITE_API_URL;

function Register() {
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    lastName: "",
    email: "",
    phone: "",
    password: "",
    birthDate: "",
  });

  const [errors, setErrors] = useState({
    name: "",
    lastName: "",
    email: "",
    phone: "",
    password: "",
    birthDate: "",
  });

  const navigate = useNavigate();

  const onSubmit = async (e) => {
    e.preventDefault();

    // Validaciones
    let formIsValid = true;

    // Validar nombre
    if (!formData.name.trim()) {
      setErrors((prevErrors) => ({
        ...prevErrors,
        name: "The name is required",
      }));
      formIsValid = false;
    }

    // Validar apellido
    if (!formData.lastName.trim()) {
      setErrors((prevErrors) => ({
        ...prevErrors,
        lastName: "The last name is required",
      }));
      formIsValid = false;
    }

    // Validar teléfono
    if (!formData.phone.trim()) {
      setErrors((prevErrors) => ({
        ...prevErrors,
        phone: "The phone number is required",
      }));
      formIsValid = false;
    }

    // Validar email
    if (!formData.email.trim()) {
      setErrors((prevErrors) => ({
        ...prevErrors,
        email: "The e-mail is required",
      }));
      formIsValid = false;
    } else if (
      !/^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/.test(formData.email)
    ) {
      setErrors((prevErrors) => ({
        ...prevErrors,
        email: "Please insert a valid e-mail",
      }));
      formIsValid = false;
    }

    // Validar contraseña
    if (formData.password.length < 6) {
      setErrors((prevErrors) => ({
        ...prevErrors,
        password: "The password must have at least 6 characters",
      }));
      formIsValid = false;
    }

    if (formIsValid) {
      setLoading(true);
      try {
        const response = await fetch(`${apiUrl}/user/`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        });

        // Verificar el código de estado en la respuesta
        if (response.status === 201) {
          // Mostrar SweetAlert de registro exitoso
          swal({
            icon: "success",
            title: "Your registration was successful",
            text: "We redirecting you to the login page",
          }).then(() => {
            navigate("/login");
          });
          // Registro exitoso, puedes hacer algo aquí (por ejemplo, redirigir)
        } else if (response.status === 400) {
          const errorMessage = response.data?.message || "Register error";
          setErrors((prevErrors) => ({ ...prevErrors, general: errorMessage }));
        } else {
          const errorMessage = "Register error";
          setErrors((prevErrors) => ({ ...prevErrors, general: errorMessage }));
        }
      } catch (error) {
        console.error(error);
        const errorMessage = error.response?.data?.message || "Register error";
        setErrors((prevErrors) => ({ ...prevErrors, general: errorMessage }));
      } finally {
        setLoading(false);
      }
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));

    // Limpiar errores cuando se edita el campo
    setErrors((prevErrors) => ({ ...prevErrors, [name]: "" }));
  };

  return (
    <>
      <Header />
      <div className="flex flex-col items-center justify-start shadow bg-[url('/fondoLogin.jpg')] h-[100vh] bg-cover bg-center text-main-0 dark:text-main-1000">
        <div className="flex flex-col rounded bg-main-50 dark:bg-main-950 mt-8 px-8 justify-center items-center py-3 shadow-xl">
          <h1 className="text-2xl font-bold my-4">Register</h1>

          <form onSubmit={onSubmit} className="flex flex-col gap-2 p-4 ">
            <TextField
              type="text"
              name="name"
              label="Your name"
              placeholder="Your name"
              value={formData.name}
              onChange={handleChange}
              disabled={loading}
            />
            <p className="text-red-600 dark:text-red-400">{errors.name}</p>
            <TextField
              type="text"
              name="lastName"
              placeholder="Your last name"
              label="Your last name"
              value={formData.lastName}
              onChange={handleChange}
              disabled={loading}
            />
            <p className="text-red-600 dark:text-red-400">{errors.lastName}</p>

            <TextField
              type="text"
              name="phone"
              placeholder="Your Phone Number"
              label="Your Phone Number"
              value={formData.phone}
              disabled={loading}
              onChange={handleChange}
            />
            <TextField
              // label="Your birthdate"
              type="date"
              name="birthDate"
              //placeholder="your-email@domain.com"
              value={formData.birthDate}
              disabled={loading}
              onChange={handleChange}
            />
            <p className="text-red-600 dark:text-red-400">{errors.phone}</p>

            <TextField
              label="Your email"
              type="text"
              name="email"
              placeholder="your-email@domain.com"
              value={formData.email}
              disabled={loading}
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
                disabled={loading}
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
              Register
            </button>
          </form>

          <p className="flex gap-x-2 justify-between">
            ¿Do you have an account?
            <Link to="/login" className="text-green-600 dark:text-green-400">
              Log in
            </Link>
          </p>
        </div>
      </div>
      <Footer />
    </>
  );
}

export default Register;
