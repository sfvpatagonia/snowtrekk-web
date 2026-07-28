import { useState } from "react";
import BasicModal from "@/components/basicModal/BasicModal";
import { TextField } from "@mui/material";
import shop from "@/services/shop";
import { useSelector } from "react-redux";

export default function PoliciesModal({ open, policy, setOpen, idShop }) {
  const [formData, setFormData] = useState({
    [policy.name]: policy.prev,
  });
  const [error, setError] = useState(null);
  const user = useSelector((state) => state.user);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    setLoading(true);
    e.preventDefault();
    shop
      .changePolicy(idShop, formData, user.token)
      .then((data) => {
        if (data.ok) {
          setOpen();
        } else {
          setError(data.message);
        }
      })
      .catch((error) => setError("An error occurred"))
      .finally(() => setLoading(false));
  };

  return (
    <BasicModal open={open} setOpen={setOpen}>
      <div className="flex flex-col w-full max-w-[800px] p-4 gap-8 bg-main-100 dark:bg-main-900 rounded">
        <h2 className="text-main-0 dark:text-main-1000 text-2xl">
          {policy.label}
        </h2>
        <form className="flex flex-col gap-2 flex-1" onSubmit={handleSubmit}>
          <TextField
            label={policy.label}
            name={policy.name}
            value={formData[policy.name]}
            disabled={loading}
            onChange={handleChange}
            rows={12}
            multiline
          />
          {error && <p className="text-red-600 ">{error}</p>}
          <button className="button" type="submit" disabled={loading}>
            {loading ? "Saving..." : "Save"}
          </button>
        </form>
      </div>
    </BasicModal>
  );
}
