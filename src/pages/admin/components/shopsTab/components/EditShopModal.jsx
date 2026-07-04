import { useState, useEffect } from "react";
import {
  Modal,
  TextField,
  CircularProgress,
  Box,
  MenuItem,
} from "@mui/material";
import { parsePhone, phonePrefixes } from "../../../../../utils/phonePrefixes";
import ReactCountryFlag from "react-country-flag";
import { useSelector } from "react-redux";
import admin from "../../../../../services/admin";

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
      const { number: phoneNumber, prefix: phonePrefix } = parsePhone(
        shopData.phone || "",
      );
      const { number: mobileNumber } = parsePhone(shopData.mobile || "");

      setShop({
        ...shopData,
        phone: phoneNumber,
        phonePrefix: phonePrefix?.code || "",
        mobile: mobileNumber,
      });
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
    if (shop.phone && !shop.phonePrefix) {
      return setError("Phone prefix is required if phone number is provided");
    }

    if (shop.mobile && !shop.phonePrefix) {
      return setError("Phone prefix is required if mobile number is provided");
    }

    setLoading(true);

    setShop((prev) => ({
      ...prev,
      phone: shop.phone ? shop.phonePrefix + shop.phone : "",
      mobile: shop.mobile ? shop.phonePrefix + shop.mobile : "",
    }));

    admin
      .updateBasicInfoShop(shop, user.token)
      .then((data) => {
        if (!data.ok) {
          return setError(data.message);
        }

        setMessage("Shop updated successfully");
        setOpen(false);
        if (setShops) {
          setShops((prev) => prev.map((s) => (s.id === shop.id ? shop : s)));
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
            <TextField
              select
              label="Country"
              name="phonePrefix"
              fullWidth
              value={shop.phonePrefix}
              disabled={loading}
              onChange={handleChange}
              SelectProps={{
                renderValue: (value) => {
                  const country = phonePrefixes.find((p) => p.code === value);
                  return (
                    <Box display="flex" alignItems="center" gap={1}>
                      <ReactCountryFlag
                        svg
                        countryCode={country?.iso}
                        style={{ width: "1.5em", height: "1.5em" }}
                      />
                      <span>{country?.code}</span>
                    </Box>
                  );
                },
              }}
            >
              {phonePrefixes.map((p) => (
                <MenuItem key={p.code + p.country} value={p.code}>
                  <Box display="flex" alignItems="center" gap={1}>
                    <ReactCountryFlag
                      svg
                      countryCode={p.iso}
                      style={{ width: "1.2em", height: "1.2em" }}
                    />
                    <span>{p.country}</span>
                    <span style={{ opacity: 0.6 }}>{p.code}</span>
                  </Box>
                </MenuItem>
              ))}
            </TextField>

            <TextField
              label="Phone number"
              name="phone"
              value={shop.phone}
              disabled={loading}
              onChange={handleChange}
              fullWidth
            />
            <TextField
              label="Mobile number"
              name="mobile"
              value={shop.mobile}
              disabled={loading}
              onChange={handleChange}
              fullWidth
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
