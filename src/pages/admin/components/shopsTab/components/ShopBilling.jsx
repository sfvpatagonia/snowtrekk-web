import { Box, MenuItem, TextField } from "@mui/material";
import { useState } from "react";
import { useSelector } from "react-redux";
import admin from "../../../../../services/admin";
import { formatDateMMMMdYYYY } from "../../../../../utils/dateParser";

const ShopBilling = ({ shop, setShop, setMessage, setError }) => {
  const [newBillingInfo, setNewBillingInfo] = useState(null);
  const [newBillingPrice, setNewBillingPrice] = useState(null);
  const [loading, setLoading] = useState(false);

  const user = useSelector((state) => state.user);

  const handlePrice = (e) => {
    const { name, value } = e.target;

    setNewBillingPrice((prev) => ({
      ...prev,
      [name]: value,
    }));
  };
  const handleInfo = (e) => {
    const { name, value } = e.target;
    setNewBillingInfo((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmitPrice = async () => {
    setLoading(true);

    try {
      const data = await admin.updateBillingPriceShop(
        shop.id,
        newBillingPrice,
        user.token,
      );

      if (data.ok) {
        setMessage(data.message);

        setShop((prev) => ({
          ...prev,
          ...data.body.updatedShop,
        }));
        setNewBillingPrice(null);
      } else {
        setError(data.message);
      }
    } catch (error) {
      setError("Network error. Please try again later.");
    } finally {
      setLoading(false);
    }
  };
  const handleSubmitInfo = async () => {
    setLoading(true);

    try {
      const data = await admin.updateBillingInfoShop(
        shop.id,
        newBillingInfo,
        user.token,
      );

      if (data.ok) {
        setMessage(data.message);

        setShop((prev) => ({
          ...prev,
          ...data.body.updatedShop,
        }));
        setNewBillingInfo(null);
      } else {
        setError(data.message);
      }
    } catch (error) {
      setError("Network error. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex gap-4">
      <div className="grid w-1/2 grid-cols-2 gap-6 text-black dark:text-white">
        {newBillingPrice ? (
          <>
            <TextField
              select
              label="Subscription Status"
              name="status"
              fullWidth
              value={newBillingPrice.status}
              disabled={loading}
              onChange={handlePrice}
              InputProps={{ className: "bg-main-50 dark:bg-main-950" }}
              SelectProps={{
                renderValue: (value) => {
                  return (
                    <Box display="flex" alignItems="center" gap={1}>
                      <span className="capitalize">{value}</span>
                    </Box>
                  );
                },
              }}
            >
              {["active", "inactive", "pending", "suspended"].map((status) => (
                <MenuItem key={status} value={status}>
                  <Box display="flex" alignItems="center" gap={1}>
                    <span className="capitalize">{status}</span>
                  </Box>
                </MenuItem>
              ))}
            </TextField>

            <TextField
              label="Subscription Plan"
              name="subscriptionPrice"
              value={newBillingPrice.subscriptionPrice}
              onChange={handlePrice}
              fullWidth
              disabled={loading}
              InputProps={{ className: "bg-main-50 dark:bg-main-950" }}
            />
            <TextField
              label="Commission Fee"
              name="commissionRate"
              value={newBillingPrice.commissionRate}
              onChange={handlePrice}
              fullWidth
              disabled={loading}
              InputProps={{ className: "bg-main-50 dark:bg-main-950" }}
            />
            <div className="bg-main-50 dark:bg-main-950 p-4 rounded">
              <h3 className="text-sm text-gray-500 dark:text-gray-200">
                Subscription start at
              </h3>

              <p className="text-xl font-bold">
                {formatDateMMMMdYYYY(shop.subscriptionStartDate) ?? "-"}
              </p>
            </div>
            <div></div>
            <div className="flex justify-end gap-2 items-center">
              <button
                className="button"
                onClick={handleSubmitPrice}
                disabled={loading}
              >
                Update
              </button>
              <button
                className="button"
                onClick={() => setNewBillingPrice(null)}
                disabled={loading}
              >
                Cancel
              </button>
            </div>
          </>
        ) : (
          <>
            <div className="bg-main-50 dark:bg-main-950 p-4 rounded">
              <h3 className="text-sm text-gray-500 dark:text-gray-200">
                Subscription Status
              </h3>

              <p className="text-xl font-bold capitalize">{shop.status}</p>
            </div>
            <div className="bg-main-50 dark:bg-main-950 p-4 rounded">
              <h3 className="text-sm text-gray-500 dark:text-gray-200">
                Subscription Plan
              </h3>

              <p className="text-xl font-bold">
                {shop.subscriptionPrice !== 0.0
                  ? "U$D " + shop.subscriptionPrice?.toFixed(2)
                  : "Free"}
              </p>
            </div>
            <div className="bg-main-50 dark:bg-main-950 p-4 rounded">
              <h3 className="text-sm text-gray-500 dark:text-gray-200">
                Commission Fee
              </h3>

              <p className="text-xl font-bold">
                {shop.commissionRate * 100 || 0}%
              </p>
            </div>
            <div className="bg-main-50 dark:bg-main-950 p-4 rounded">
              <h3 className="text-sm text-gray-500 dark:text-gray-200">
                Subscription start at
              </h3>

              <p className="text-xl font-bold">
                {shop.subscriptionStartDate
                  ? formatDateMMMMdYYYY(shop.subscriptionStartDate)
                  : "-"}
              </p>
            </div>
            <button
              className="button"
              onClick={() =>
                setNewBillingPrice({
                  commissionRate: shop.commissionRate,
                  subscriptionPrice: shop.subscriptionPrice,
                  status: shop.status,
                })
              }
            >
              Update Billing Price
            </button>
          </>
        )}
      </div>
      <div className="grid w-1/2 grid-cols-2 gap-6 text-black dark:text-white">
        {newBillingInfo ? (
          <>
            <TextField
              label="Tax ID"
              name="taxId"
              value={newBillingInfo.taxId}
              onChange={handleInfo}
              fullWidth
              disabled={loading}
              InputProps={{ className: "bg-main-50 dark:bg-main-950" }}
            />
            <TextField
              label="Country"
              name="country"
              value={newBillingInfo.country}
              onChange={handleInfo}
              fullWidth
              disabled={loading}
              InputProps={{ className: "bg-main-50 dark:bg-main-950" }}
            />
            <TextField
              label="State"
              name="state"
              value={newBillingInfo.state}
              onChange={handleInfo}
              fullWidth
              disabled={loading}
              InputProps={{ className: "bg-main-50 dark:bg-main-950" }}
            />
            <TextField
              label="City"
              name="city"
              value={newBillingInfo.city}
              onChange={handleInfo}
              fullWidth
              disabled={loading}
              InputProps={{ className: "bg-main-50 dark:bg-main-950" }}
            />
            <TextField
              label="Address"
              name="address"
              value={newBillingInfo.address}
              onChange={handleInfo}
              fullWidth
              disabled={loading}
              InputProps={{ className: "bg-main-50 dark:bg-main-950" }}
            />
            <TextField
              label="Postal Code"
              name="postalCode"
              value={newBillingInfo.postalCode}
              onChange={handleInfo}
              fullWidth
              disabled={loading}
              InputProps={{ className: "bg-main-50 dark:bg-main-950" }}
            />

            <div></div>
            <div className="flex justify-end gap-2 items-center">
              <button
                className="button"
                onClick={handleSubmitInfo}
                disabled={loading}
              >
                Update
              </button>
              <button
                className="button"
                onClick={() => setNewBillingInfo(null)}
                disabled={loading}
              >
                Cancel
              </button>
            </div>
          </>
        ) : (
          <>
            <div className="flex flex-1 flex-row gap-2 bg-main-50 dark:bg-main-950 lg:justify-center p-2 rounded flex-wrap">
              <b>Tax id</b>
              <p className="max-w-full whitespace-nowrap overflow-hidden text-ellipsis">
                {shop.taxId}
              </p>
            </div>
            <div className="flex flex-1 flex-row gap-2 bg-main-50 dark:bg-main-950 lg:justify-center p-2 rounded flex-wrap">
              <b>Country</b>
              <p className="max-w-full whitespace-nowrap overflow-hidden text-ellipsis">
                {shop.country}
              </p>
            </div>
            <div className="flex flex-1 flex-row gap-2 bg-main-50 dark:bg-main-950 lg:justify-center p-2 rounded flex-wrap">
              <b>State</b>
              <p className="max-w-full whitespace-nowrap overflow-hidden text-ellipsis">
                {shop.state}
              </p>
            </div>
            <div className="flex flex-1 flex-row gap-2 bg-main-50 dark:bg-main-950 lg:justify-center p-2 rounded flex-wrap">
              <b>City</b>
              <p className="max-w-full whitespace-nowrap overflow-hidden text-ellipsis">
                {shop.city}
              </p>
            </div>
            <div className="flex flex-1 flex-row gap-2 bg-main-50 dark:bg-main-950 lg:justify-center p-2 rounded flex-wrap">
              <b>Address</b>
              <p className="max-w-full whitespace-nowrap overflow-hidden text-ellipsis">
                {shop.address}
              </p>
            </div>
            <div className="flex flex-1 flex-row gap-2 bg-main-50 dark:bg-main-950 lg:justify-center p-2 rounded flex-wrap">
              <b>Postal Code</b>
              <p className="max-w-full whitespace-nowrap overflow-hidden text-ellipsis">
                {shop.postalCode}
              </p>
            </div>
            <button
              className="button"
              onClick={() =>
                setNewBillingInfo({
                  taxId: shop.taxId,
                  country: shop.country,
                  state: shop.state,
                  city: shop.city,
                  address: shop.address,
                  postalCode: shop.postalCode,
                })
              }
            >
              Update Billing Information
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default ShopBilling;
