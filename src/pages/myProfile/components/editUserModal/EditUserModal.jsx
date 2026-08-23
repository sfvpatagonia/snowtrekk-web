import { useState } from "react";
import { TextField } from "@mui/material";
import BasicModal from "@/components/basicModal/BasicModal";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
import userService from "@/services/user";
import { useDispatch } from "react-redux";
import { addUser } from "@/redux/userSlice";

dayjs.extend(utc);
dayjs.extend(timezone);

export default function EditUserModal({ open, setOpen, user }) {
  const [updatedUser, setUpdatedUser] = useState(user);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUpdatedUser((prevData) => ({
      ...prevData,
      [name]: value,
    }));
    setError(null);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    setLoading(true);

    if (!updatedUser.name || !updatedUser.lastName) {
      return setError("Name and Last name are required.");
    }

    if (
      user.name === updatedUser.name &&
      user.lastName === updatedUser.lastName &&
      user.phone === updatedUser.phone &&
      user.birthDate === new Date(updatedUser.birthDate).toISOString()
    ) {
      return setError("No changes were made.");
    }

    userService
      .updateUser(updatedUser)
      .then((data) => {
        if (data.ok) {
          dispatch(addUser({ ...data.body.updatedUser, token: user.token }));
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
          Edit personal information
        </h2>
        <form className="flex flex-col gap-4 p-2" onSubmit={handleSubmit}>
          <TextField
            label="Name"
            name="name"
            value={updatedUser.name}
            disabled={loading}
            onChange={handleChange}
          />
          <TextField
            label="Last name"
            name="lastName"
            value={updatedUser.lastName}
            disabled={loading}
            onChange={handleChange}
          />
          {/* {hasShop && (
            <FormControl fullWidth>
              <InputLabel id="select-label">Is a branch?</InputLabel>
              <Select
                labelId="select-label"
                id="select"
                value={updatedUser.idShop}
                name="idShop"
                label="Is a branch?"
                onChange={handleChange}
                sx={{ textAlign: "left" }}
              >
                <MenuItem value="Head Office">No</MenuItem>
                {updatedUser.map((shop, index) => (
                  <MenuItem value={shop.id} key={index}>
                    {shop.name}´s branch
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          )} */}
          <TextField
            label="Phone"
            name="phone"
            value={updatedUser.phone}
            disabled={loading}
            onChange={handleChange}
          />

          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DatePicker
              label="Date of birth"
              format="DD/MM/YYYY"
              defaultValue={dayjs(new Date(updatedUser.birthDate))}
              timezone="UTC"
              name="birthDate"
              disabled={loading}
              onChange={(newValue) => {
                setUpdatedUser((prevData) => ({
                  ...prevData,
                  birthDate: newValue,
                }));
                setError(null);
              }}
            />
          </LocalizationProvider>

          {error && <p>{error}</p>}
          <button className="button" type="submit">
            Save
          </button>
        </form>
      </div>
    </BasicModal>
  );
}
