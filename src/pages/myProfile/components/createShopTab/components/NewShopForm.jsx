import { useEffect, useState } from "react";
import {
  Box,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  TextField,
} from "@mui/material";
import shop from "@/services/shop";
import { useSelector } from "react-redux";
import BasicModal from "@/components/basicModal/BasicModal";
import { CheckCircleOutlined } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";

import ReactCountryFlag from "react-country-flag";
import { phonePrefixes } from "../../../../../utils/phonePrefixes";

export default function NewShopForm() {
  const initialState = {
    name: "",
    idShop: null,
    phone: "",
    mobile: "",
    email: "",
    description: "",
    legalName: "",
    phonePrefix: "+54",
    website: "",
    taxId: "",
    address: "",
    city: "",
    state: "",
    postalCode: "",
    country: "Argentina",
  };
  const user = useSelector((state) => state.user);
  const hasShop = user.hasShop;
  const [newShop, setNewShop] = useState(initialState);
  const [shops, setShops] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [confirmModal, setConfirmModal] = useState(false);
  const [billingModal, setBillingModal] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (hasShop) {
      shop.getShopsByUserId(user.id, user.token).then((data) => {
        if (data.ok) {
          setShops(data.body.shops);
        }
      });
    }
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewShop((prevData) => ({
      ...prevData,
      [name]: value,
    }));
    setError(null);
  };

  const handleOpenBillingModal = (e) => {
    e.preventDefault();

    const {
      name,
      legalName,
      description,
      email,
      phone,
      mobile,
      phonePrefix,
      taxId,
      country,
      state,
      city,
      postalCode,
      address,
      website,
    } = newShop;

    if (
      !name ||
      !legalName ||
      !description ||
      !email ||
      (!phone && !mobile) ||
      !phonePrefix ||
      !taxId ||
      !country ||
      !state ||
      !city ||
      !postalCode ||
      !address
    ) {
      return setError("Complete all the required fields");
    }
    setBillingModal(true);
  };
  const handleSubmit = () => {
    const {
      name,
      legalName,
      description,
      email,
      phone,
      mobile,
      phonePrefix,
      taxId,
      country,
      state,
      city,
      postalCode,
      address,
      website,
    } = newShop;

    setLoading(true);
    const data = new FormData();
    data.append("name", name);
    data.append("legalName", legalName);
    data.append("description", description);
    data.append("email", email);
    data.append("phone", phonePrefix + phone);
    data.append("mobile", phonePrefix + mobile);
    data.append("taxId", taxId);
    data.append("country", country);
    data.append("state", state);
    data.append("city", city);
    data.append("postalCode", postalCode);
    data.append("address", address);
    data.append("website", website);

    if (newShop.idShop) {
      data.append("idShop", newShop.idShop);
    }

    shop
      .createShop(data, user.token)
      .then((data) => {
        if (data.ok) {
          setConfirmModal(true);
        } else {
          setError(data.message);
        }
      })
      .finally(() => setLoading(false));
  };

  return (
    <>
      <form className="flex flex-col w-full max-w-4xl gap-4 p-4 bg-main-50 dark:bg-main-950 rounded shadow">
        <h2 className="text-xl font-bold text-left">Shop information</h2>
        <div className="flex w-full items-center gap-4">
          <TextField
            label="Shop name"
            name="name"
            value={newShop.name}
            disabled={loading}
            onChange={handleChange}
            sx={{ flex: 1 }}
            required
          />
          <TextField
            label="Email (Not will be used for login)"
            name="email"
            value={newShop.email}
            disabled={loading}
            onChange={handleChange}
            sx={{ flex: 1 }}
            required
          />
        </div>
        <div className="flex w-full items-center gap-4">
          <TextField
            label="Website"
            name="website"
            value={newShop.website}
            disabled={loading}
            onChange={handleChange}
            sx={{ flex: 1 }}
          />
          {hasShop && (
            <FormControl fullWidth sx={{ flex: 1 }}>
              <InputLabel id="select-label">Is a branch?</InputLabel>
              <Select
                labelId="select-label"
                id="select"
                value={newShop.idShop}
                name="idShop"
                label="Is a branch?"
                onChange={handleChange}
                sx={{ textAlign: "left" }}
              >
                <MenuItem value="No">No</MenuItem>
                {shops.map((shop, index) => (
                  <MenuItem value={shop.id} key={index}>
                    {shop.name}´s branch
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          )}
        </div>
        <TextField
          label="Description"
          name="description"
          value={newShop.description}
          disabled={loading}
          onChange={handleChange}
          rows={4}
          multiline
          required
        />
        <Box display="flex" alignItems="center" gap={2}>
          <TextField
            select
            label="Country"
            name="phonePrefix"
            fullWidth
            value={newShop.phonePrefix}
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
              <MenuItem key={p.code} value={p.code}>
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
            value={newShop.phone}
            disabled={loading}
            onChange={handleChange}
            fullWidth
          />
          <TextField
            label="Mobile number"
            name="mobile"
            value={newShop.mobile}
            disabled={loading}
            onChange={handleChange}
            fullWidth
          />
        </Box>
        <h2 className="text-xl font-bold text-left">Billing information</h2>
        <div className="flex w-full items-center gap-4">
          <TextField
            label="Legal name"
            name="legalName"
            value={newShop.legalName}
            disabled={loading}
            onChange={handleChange}
            sx={{ flex: 1 }}
            required
          />
          <TextField
            label="Tax ID"
            name="taxId"
            value={newShop.taxId}
            disabled={loading}
            onChange={handleChange}
            sx={{ flex: 1 }}
            required
          />
        </div>
        <div className="flex w-full items-center gap-4">
          <TextField
            label="country"
            name="country"
            value={newShop.country}
            disabled={loading}
            onChange={handleChange}
            required
          />
          <TextField
            label="State"
            name="state"
            value={newShop.state}
            disabled={loading}
            onChange={handleChange}
            sx={{ flex: 1 }}
            required
          />
          <TextField
            label="City"
            name="city"
            value={newShop.city}
            disabled={loading}
            onChange={handleChange}
            sx={{ flex: 1 }}
            required
          />
        </div>
        <div className="flex w-full items-center gap-4">
          <TextField
            label="Address"
            name="address"
            value={newShop.address}
            disabled={loading}
            onChange={handleChange}
            sx={{ flex: 1 }}
            required
          />
          <TextField
            label="Postal Code"
            name="postalCode"
            value={newShop.postalCode}
            disabled={loading}
            onChange={handleChange}
            sx={{ flex: 1 }}
            required
          />
        </div>
        {error && <p className="text-red-500">{error}</p>}
        <div className="flex justify-center">
          <button
            className="button"
            type="button"
            onClick={(e) => handleOpenBillingModal(e)}
            disabled={loading}
          >
            Create shop
          </button>
        </div>
      </form>

      <BasicModal open={billingModal} setOpen={setBillingModal}>
        <div className="bg-main-100 dark:bg-main-900 p-8 rounded-lg flex flex-col items-center justify-center gap-4 aspect-video text-black dark:text-white">
          <div className="flex gap-4">
            <div className="flex flex-col bg-main-50 dark:bg-main-950 p-4 rounded shadow gap-2 flex-1">
              <h2 className="text-xl">Subscription</h2>

              <h3 className="text-6xl font-bold">
                0 <span className="text-3xl font-normal">U$D /month</span>{" "}
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-200">
                Your shop will be created with the free plan. After 6 months you
                will be charged U$D 24.99 / month. You can change or cancel your
                subscription at any time.
              </p>
            </div>
            <div className="flex flex-col bg-main-50 dark:bg-main-950 p-4 rounded shadow gap-2 flex-1">
              <h2 className="text-xl">Commission</h2>
              <h3 className="text-6xl font-bold">
                20 <span className="text-3xl font-normal">% / sale</span>{" "}
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-200">
                Snowtrekk will take a 20% commission from each sale. You can
                check more details about our policies in the terms and
                conditions. If you have any questions or want to change this,
                please contact our support team.
              </p>
            </div>
          </div>

          <div className="flex gap-4">
            <button className="button" onClick={() => setBillingModal(false)}>
              Cancel
            </button>
            <button
              className="button"
              onClick={() => {
                handleSubmit();
                setBillingModal(false);
              }}
            >
              Ok
            </button>
          </div>
        </div>
      </BasicModal>
      <BasicModal open={confirmModal} setOpen={setConfirmModal}>
        <div className="bg-main-100 dark:bg-main-900 p-8 rounded-lg flex flex-col items-center justify-center gap-4 aspect-video">
          <CheckCircleOutlined
            color="success"
            sx={{ fontSize: 130 }}
            className="w-40"
          />

          <p className="text-xl text-main-0 dark:text-main-1000">
            Shop created succesfully
          </p>
          <button className="button" onClick={() => navigate("/my-shop")}>
            Ok
          </button>
        </div>
      </BasicModal>
    </>
  );
}
