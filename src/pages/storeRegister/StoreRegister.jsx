import { useState } from "react";
import Header from "@/components/header/Header";
import Footer from "@/components/footer/Footer";
import { TextField, MenuItem } from "@mui/material";
import storeApplicationsService from "@/services/storeApplications";

const CATEGORIES = [
  { value: "restaurant", label: "Restaurant" },
  { value: "lodging", label: "Lodging" },
  { value: "pharmacy", label: "Pharmacy" },
  { value: "transport", label: "Transport" },
  { value: "rental", label: "Rental" },
  { value: "mountain_shop", label: "Mountain Shop" },
  { value: "tourism", label: "Tourism" },
];

const initialFormData = {
  businessName: "",
  ownerName: "",
  email: "",
  phone: "",
  website: "",
  category: "",
  destinationCity: "",
  description: "",
  instagram: "",
  facebook: "",
  whatsapp: "",
};

function StoreRegister() {
  const [formData, setFormData] = useState(initialFormData);
  const [logo, setLogo] = useState(null);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const handleLogoChange = (e) => {
    setLogo(e.target.files[0] || null);
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.businessName.trim())
      newErrors.businessName = "Business name is required";
    if (!formData.ownerName.trim())
      newErrors.ownerName = "Owner name is required";
    if (!formData.email.trim()) newErrors.email = "Email is required";
    if (!formData.phone.trim()) newErrors.phone = "Phone is required";
    if (!formData.category) newErrors.category = "Category is required";
    if (!formData.destinationCity.trim())
      newErrors.destinationCity = "Destination/city is required";
    return newErrors;
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setLoading(true);
    try {
      const body = new FormData();
      Object.entries(formData).forEach(([key, value]) => body.append(key, value));
      if (logo) body.append("logo", logo);

      const response = await storeApplicationsService.registerStore(body);
      if (response.ok) {
        setSubmitted(true);
      } else {
        setErrors((prev) => ({
          ...prev,
          general: response.message || "Something went wrong",
        }));
      }
    } catch (error) {
      console.error(error);
      setErrors((prev) => ({ ...prev, general: "Something went wrong" }));
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Header />
      <div className="flex flex-col items-center justify-start py-12 min-h-screen bg-main-100 dark:bg-main-900 text-main-0 dark:text-main-1000">
        <div className="flex flex-col rounded bg-main-50 dark:bg-main-950 px-8 py-6 max-w-xl w-full shadow-xl">
          <h1 className="text-2xl font-bold my-4 text-center">
            Registrá tu negocio en Snowtrekk
          </h1>

          {submitted ? (
            <div className="flex flex-col items-center gap-4 py-8 text-center">
              <p className="text-lg">
                Recibimos tu solicitud. Te contactaremos para verificar tus
                datos.
              </p>
            </div>
          ) : (
            <form
              onSubmit={onSubmit}
              className="flex flex-col gap-3 p-2"
              encType="multipart/form-data"
            >
              <TextField
                label="Nombre del negocio"
                name="businessName"
                value={formData.businessName}
                onChange={handleChange}
                disabled={loading}
              />
              <p className="text-red-600 dark:text-red-400">
                {errors.businessName}
              </p>

              <TextField
                label="Nombre del propietario"
                name="ownerName"
                value={formData.ownerName}
                onChange={handleChange}
                disabled={loading}
              />
              <p className="text-red-600 dark:text-red-400">
                {errors.ownerName}
              </p>

              <TextField
                label="Email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                disabled={loading}
              />
              <p className="text-red-600 dark:text-red-400">{errors.email}</p>

              <TextField
                label="Teléfono"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                disabled={loading}
              />
              <p className="text-red-600 dark:text-red-400">{errors.phone}</p>

              <TextField
                label="Sitio web"
                name="website"
                value={formData.website}
                onChange={handleChange}
                disabled={loading}
              />

              <TextField
                select
                label="Categoría"
                name="category"
                value={formData.category}
                onChange={handleChange}
                disabled={loading}
              >
                {CATEGORIES.map((option) => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </TextField>
              <p className="text-red-600 dark:text-red-400">
                {errors.category}
              </p>

              <TextField
                label="Destino / Ciudad"
                name="destinationCity"
                value={formData.destinationCity}
                onChange={handleChange}
                disabled={loading}
              />
              <p className="text-red-600 dark:text-red-400">
                {errors.destinationCity}
              </p>

              <TextField
                label="Descripción"
                name="description"
                value={formData.description}
                onChange={handleChange}
                disabled={loading}
                multiline
                rows={3}
              />

              <TextField
                label="Instagram"
                name="instagram"
                value={formData.instagram}
                onChange={handleChange}
                disabled={loading}
              />
              <TextField
                label="Facebook"
                name="facebook"
                value={formData.facebook}
                onChange={handleChange}
                disabled={loading}
              />
              <TextField
                label="WhatsApp"
                name="whatsapp"
                value={formData.whatsapp}
                onChange={handleChange}
                disabled={loading}
              />

              <div className="flex flex-col gap-1">
                <label className="text-sm">Logo</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleLogoChange}
                  disabled={loading}
                />
              </div>

              <p className="text-red-600 dark:text-red-400">
                {errors.general}
              </p>

              <button className="button" disabled={loading}>
                {loading ? "Enviando..." : "Enviar solicitud"}
              </button>
            </form>
          )}
        </div>
      </div>
      <Footer />
    </>
  );
}

export default StoreRegister;
