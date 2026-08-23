import React, { useState } from "react";
import { useSelector } from "react-redux";
import { TextField } from "@mui/material";
import styles from "./passwordModal.module.css";
import BasicModal from "@/components/basicModal/BasicModal";
import userService from "@/services/user";

export default function PasswordModal({ open, setOpen }) {
  const shop = useSelector((state) => state.shop);
  const [formData, setFormData] = useState({
    actualPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
    setError(null);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    setLoading(true);

    if (
      !formData.actualPassword ||
      !formData.newPassword ||
      !formData.confirmPassword
    ) {
      setLoading(false);
      return setError("Complete all the fields");
    }

    if (formData.newPassword !== formData.confirmPassword) {
      setLoading(false);
      return setError("Passwords do not match");
    }

    userService
      .changePassword(formData)
      .then((data) => {
        if (data.ok) {
          setOpen(false);
        } else {
          setError(data.message);
        }
      })
      .finally(() => setLoading(false));
  };

  return (
    <BasicModal open={open} setOpen={setOpen}>
      <div className="flex flex-col items-center justify-between shadow-lg w-[95%] h-auto bg-main-100 dark:bg-main-900 max-w-[800px] rounded-lg p-8 gap-4 overflow-auto">
        <h2 className="hidden md:block font-bold text-main-0 dark:text-main-1000 ">
          Change password
        </h2>
        <form className={styles.form} onSubmit={handleSubmit}>
          <TextField
            label="Actual password"
            name="actualPassword"
            value={formData.actualPassword}
            disabled={loading}
            onChange={handleChange}
            type="password"
          />
          <TextField
            label="New password"
            name="newPassword"
            value={formData.newPassword}
            disabled={loading}
            onChange={handleChange}
            type="password"
          />
          <TextField
            label="Confirm password"
            name="confirmPassword"
            value={formData.confirmPassword}
            disabled={loading}
            onChange={handleChange}
            type="password"
          />
          {error && <p>{error}</p>}
          <button className="button" type="submit">
            Save
          </button>
        </form>
      </div>
    </BasicModal>
  );
}
