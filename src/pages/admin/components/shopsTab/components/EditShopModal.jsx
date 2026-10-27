import { useState, useEffect } from "react";
import { Modal, TextField, CircularProgress, Box } from "@mui/material";
import { useSelector } from "react-redux";
import admin from "../../../../../services/admin";
import PhoneInput from "../../../../../components/PhoneInput";

export default function EditShopModal({
  open,
  setOpen,
  shopData,
  setMessage,
  setError,
  setShops,
}) {
  const [shop, setShop] = useState({ ...shopData });
  const [loading, setLoading] = useState(false);
  const user = useSelector((state) => state.user);

  useEffect(() => {
    if (shopData) {
      setShop({ ...shopData });
    }
  }, [shopData]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setShop((prev) => ({
      ...prev,
      [name]: value,
    }));

    setError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!shop.name) {
      return setError("Shop name is required");
    }

    if (!shop.description) {
      return setError("Shop description is required");
    }

    if (!shop.email) {
      return setError("Shop email is required");
    }

    setLoading(true);

    admin
      .updateBasicInfoShop(shop, user.token)
      .then((data) => {
        if (!data.ok) {
          return setError(data.message);
        }

        const updatedShop = data.body?.updatedShop || shop;

        setMessage("Shop updated successfully");
        setOpen(false);
        if (setShops) {
          setShops((prev) =>
            prev.map((s) => (s.id === shop.id ? { ...s, ...updatedShop } : s)),
          );
        }
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const onClose = () => {
    setOpen(false);
  };

  return (
    <Modal open={open} onClose={onClose}>
      <div className="bg-main-100 dark:bg-main-900 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-3xl p-6 rounded-lg shadow-lg text-main-black dark:text-main-white flex flex-col gap-4">
        <h2 className="text-2xl font-bold text-black dark:text-white">
          Edit Shop
        </h2>

        <form className="flex flex-col gap-4">
          <div className="flex gap-4">
            <TextField
              label="Shop Name"
              name="name"
              value={shop.name}
              onChange={handleChange}
              fullWidth
            />
            <TextField
              label="Legal Name"
              name="legalName"
              value={shop.legalName}
              onChange={handleChange}
              fullWidth
            />
          </div>

          <TextField
            label="Description"
            name="description"
            value={shop.description || ""}
            onChange={handleChange}
            multiline
            rows={4}
            fullWidth
          />

          <TextField
            label="Email"
            name="email"
            value={shop.email || ""}
            onChange={handleChange}
            fullWidth
          />

          <Box display="flex" alignItems="center" gap={2}>
            <PhoneInput
              label="Phone number"
              value={shop.phone}
              disabled={loading}
              onChange={(newValue) =>
                setShop((prev) => ({ ...prev, phone: newValue }))
              }
            />
            <PhoneInput
              label="Mobile number"
              value={shop.mobile}
              disabled={loading}
              onChange={(newValue) =>
                setShop((prev) => ({ ...prev, mobile: newValue }))
              }
            />
          </Box>

          <TextField
            label="Website"
            name="website"
            value={shop.website || ""}
            onChange={handleChange}
            fullWidth
          />

          <button className="button" onClick={handleSubmit} disabled={loading}>
            {loading ? <CircularProgress size={24} /> : "Update Shop"}
          </button>
        </form>
      </div>
    </Modal>
  );
}
