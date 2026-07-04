import { useState, useEffect } from "react";
import TextField from "@mui/material/TextField";
import FormControl from "@mui/material/FormControl";
import BasicModal from "@/components/basicModal/BasicModal";
import CheckBoxOutlineBlankIcon from "@mui/icons-material/CheckBoxOutlineBlank";
import CheckBoxIcon from "@mui/icons-material/CheckBox";
import { Autocomplete, Checkbox, CircularProgress } from "@mui/material";
import admin from "@/services/admin";
import UploadImage from "@/components/UploadImage";
import setImages from "@/services/setImages";
import updatelocation from "@/services/updateLocation";
import { newCity } from "@/services/cities";

const AddCityModal = ({
  open,
  setOpen,
  refreshData,
  setError,
  setMessage,
  setCities,
  setAreas,
  editData,
  setEditData,
  areas,
}) => {
  const icon = <CheckBoxOutlineBlankIcon fontSize="small" />;
  const checkedIcon = <CheckBoxIcon fontSize="small" />;
  const initialState = {
    name: "",
    description: "",
    Area: null,
    Images: [],
  };
  const [city, setCity] = useState(editData || initialState);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (areas.length === 0) {
      admin.getAreas().then((data) => setAreas(data.body.areas));
    }
  }, []);
  const handleSubmit = async (event) => {
    event.preventDefault();

    if (city.name === "" && city.Area === null) {
      return setError("Complete the city name field and select an area");
    } else if (city.name === "") {
      return setError("Complete the vity name field");
    } else if (city.Country === null) {
      return setError("Select an area");
    }

    const formData = new FormData();

    city.Images.forEach((element) => {
      formData.append("image", element);
    });

    setLoading(true);
    if (editData) {
      updatelocation({ type: "city", ...city })
        .then((data) => {
          if (!data.ok) {
            setOpen(false);
            return setError(data.message);
          }
          setImages({ id: editData.id, type: "city" }, formData).then(() => {
            if (!data.ok) {
              setOpen(false);
              return setError(data.message);
            }
          });
          setCities((prev) =>
            prev.map((item) => (item.id === editData.id ? city : item))
          );
          setEditData(null);
          setOpen(false);
          setMessage(data.message);
          refreshData();
        })
        .finally(() => {
          setLoading(false);
        });
    } else {
      newCity(city)
        .then((data) => {
          if (!data.ok) {
            return setError(data.message);
          }
          setImages(
            { id: data.data.body.newCity.id, type: "city" },
            formData
          ).then((data2) => {
            if (!data2.ok) {
              setOpen(false);
              return setError(data2.message);
            }
          });
          setMessage(data.message);
          setOpen(false);

          refreshData();
        })
        .finally(() => {
          setLoading(false);
        });
      setCity(initialState);
    }
  };

  const onClose = () => {
    setCity(initialState);
    setEditData(null);
    return setOpen();
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCity((prevData) => ({
      ...prevData,
      [name]: value,
    }));
    setError(null);
  };

  return (
    <BasicModal open={open} setOpen={onClose}>
      <div className="absolute flex flex-col items-center justify-center px-12 py-8 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-main-100 dark:bg-main-900 rounded-lg gap-4">
        <h3 className="text-2xl text-main-0 dark:text-main-1000 font-bold">
          {editData ? "Edit" : "Add"} City
        </h3>
        <form className="flex flex-col w-full gap-4 items-center">
          <div className="flex gap-4">
            <TextField
              label="City Name"
              value={city.name}
              name="name"
              onChange={(e) => handleChange(e)}
              fullWidth
            />

            <FormControl sx={{ width: 300 }}>
              <Autocomplete
                multiple={false}
                sx={{ width: 300, maxWidth: "100%" }}
                id={`id-countries`}
                options={areas}
                value={city.Area}
                onChange={(e, newValue) => {
                  setCity((prev) => ({ ...prev, Area: newValue }));
                }}
                getOptionLabel={(option) => option.name}
                renderOption={(props, option, { selected }) => {
                  const { key, ...optionProps } = props;
                  return (
                    <li key={option.id} {...optionProps}>
                      <Checkbox
                        icon={icon}
                        checkedIcon={checkedIcon}
                        style={{ marginRight: 8 }}
                        checked={selected}
                      />
                      {option.name}
                    </li>
                  );
                }}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label={"Select Area"}
                    placeholder={"Areas"}
                  />
                )}
              />
            </FormControl>
          </div>
          <TextField
            label="Description"
            value={city.description}
            name="description"
            onChange={(e) => handleChange(e)}
            fullWidth
            multiline
            rows={10}
          />
          <UploadImage
            currentImages={city?.Images || []}
            setEditData={setCity}
          />
          <button className="button" onClick={handleSubmit} disabled={loading}>
            {loading ? (
              <CircularProgress />
            ) : editData ? (
              "Edit City"
            ) : (
              "Add City"
            )}
          </button>
        </form>
      </div>
    </BasicModal>
  );
};

export default AddCityModal;
