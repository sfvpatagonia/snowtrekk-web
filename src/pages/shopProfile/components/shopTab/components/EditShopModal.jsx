import { useState } from "react";
import BasicModal from "@/components/basicModal/BasicModal";
import {
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  TextField,
} from "@mui/material";
import { useSelector } from "react-redux";
import shopService from "@/services/shop";

export default function EditShopModal({ open, setOpen, shop, onUpdate }) {
  const [updatedShop, setUpdatedShop] = useState(shop);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const user = useSelector((state) => state.user);
  const hasShop = user.hasShop;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUpdatedShop((prevData) => ({
      ...prevData,
      [name]: value,
    }));
    setError(null);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    setLoading(true);

    if (
      !updatedShop.name ||
      !updatedShop.legalName ||
      !updatedShop.idShop ||
      !updatedShop.email ||
      !updatedShop.phone ||
      !updatedShop.type
    ) {
      return setError("Complete all the fields");
    }

    shopService
      .updateShop(shop.id, updatedShop, user.token)
      .then((data) => {
        if (data.ok) {
          onUpdate();
          setOpen(false);
        } else {
          setError(data.message);
        }
      })
      .finally(() => setLoading(false));
  };

  return (
    <BasicModal open={open} setOpen={setOpen}>
      <div className="flex flex-col w-full max-w-[800px] p-4 gap-8 bg-main-100 dark:bg-main-900 rounded">
        <h2 className="text-main-0 dark:text-main-1000 text-2xl">Edit Shop</h2>
        <form className="flex flex-col w-full gap-4" onSubmit={handleSubmit}>
          <TextField
            label="Shop name"
            name="name"
            value={updatedShop.name}
            disabled={loading}
            onChange={handleChange}
          />
          <TextField
            label="Legal name"
            name="legalName"
            value={updatedShop.legalName}
            disabled={loading}
            onChange={handleChange}
          />
          {hasShop && (
            <FormControl fullWidth>
              <InputLabel id="select-label">Is a branch?</InputLabel>
              <Select
                labelId="select-label"
                id="select"
                value={updatedShop.parentShop?.id || "Head Office"}
                name="idShop"
                label="Is a branch?"
                onChange={handleChange}
                sx={{ textAlign: "left" }}
              >
                <MenuItem value="Head Office">No</MenuItem>
                <MenuItem
                  value={updatedShop.parentShop?.id}
                >{`${updatedShop.parentShop?.name}'s branch`}</MenuItem>
                {/* {updatedShop?.map((shop, index) => (
                  <MenuItem value={shop.id} key={index}>
                    {shop.name}´s branch
                  </MenuItem>
                ))} */}
              </Select>
            </FormControl>
          )}
          <TextField
            label="Phone"
            name="phone"
            value={updatedShop.phone}
            disabled={loading}
            onChange={handleChange}
          />
          <TextField
            label="Email (Not used for login)"
            name="email"
            value={updatedShop.email}
            disabled={loading}
            onChange={handleChange}
          />
          <TextField
            label="Description"
            name="description"
            value={updatedShop.description}
            disabled={loading}
            onChange={handleChange}
            rows={4}
            multiline
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
