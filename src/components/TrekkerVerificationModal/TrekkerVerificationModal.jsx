import { useState } from "react";
import { useDispatch } from "react-redux";
import { TextField } from "@mui/material";
import BasicModal from "@/components/basicModal/BasicModal";
import PasswordField from "@/components/PasswordField/PasswordField";
import { addUser } from "@/redux/userSlice";
import userService from "@/services/user";

const initialForm = { name: "", lastName: "", country: "", password: "" };

function TrekkerVerificationModal({ open, setOpen, onSuccess }) {
  const [formData, setFormData] = useState(initialForm);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.name || !formData.lastName || !formData.country || !formData.password) {
      setError("Completá todos los campos");
      return;
    }

    setLoading(true);
    try {
      const response = await userService.completeVerification(formData);
      if (!response.ok) {
        setError(response.message || "No pudimos completar tu verificación");
        return;
      }

      dispatch(addUser(response.body.updatedUser));
      setFormData(initialForm);
      setOpen(false);
      onSuccess();
    } catch (err) {
      console.error(err);
      setError("Ocurrió un error, intentá de nuevo");
    } finally {
      setLoading(false);
    }
  };

  return (
    <BasicModal open={open} setOpen={setOpen}>
      <div className="flex flex-col items-center shadow-lg w-[95%] max-w-[420px] bg-main-100 dark:bg-main-900 rounded-lg p-8 gap-4">
        <h2 className="font-bold text-lg text-center text-main-0 dark:text-main-1000">
          Completá tu perfil de Trekker
        </h2>
        <p className="text-sm text-center text-main-0 dark:text-main-1000">
          Para comprar servicios o usar el chat con SnowtrekIA necesitamos algunos datos más.
        </p>

        <form className="flex flex-col gap-2 w-full" onSubmit={handleSubmit}>
          <TextField
            label="Nombre"
            name="name"
            value={formData.name}
            onChange={handleChange}
            disabled={loading}
          />
          <TextField
            label="Apellido"
            name="lastName"
            value={formData.lastName}
            onChange={handleChange}
            disabled={loading}
          />
          <TextField
            label="País"
            name="country"
            value={formData.country}
            onChange={handleChange}
            disabled={loading}
          />
          <PasswordField
            label="Contraseña"
            name="password"
            value={formData.password}
            onChange={handleChange}
            disabled={loading}
            helperText="Mínimo 8 caracteres, 1 mayúscula y 1 número"
          />
          {error && <p className="text-red-600 dark:text-red-400 text-sm">{error}</p>}
          <button className="button" type="submit" disabled={loading}>
            {loading ? "Guardando..." : "Confirmar"}
          </button>
        </form>
      </div>
    </BasicModal>
  );
}

export default TrekkerVerificationModal;
