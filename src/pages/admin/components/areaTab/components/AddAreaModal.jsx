import { useEffect, useState } from "react";
import CheckBoxOutlineBlankIcon from "@mui/icons-material/CheckBoxOutlineBlank";
import CheckBoxIcon from "@mui/icons-material/CheckBox";
import { newArea } from "@/services/areas";
import BasicModal from "@/components/basicModal/BasicModal";
import {
  Autocomplete,
  Checkbox,
  CircularProgress,
  FormControl,
  TextField,
} from "@mui/material";
import admin from "@/services/admin";
import UploadImage from "@/components/UploadImage";
import setImages from "@/services/setImages";
import updatelocation from "@/services/updateLocation";

const AddAreaModal = ({
  open,
  setOpen,
  setMessage,
  setError,
  refreshData,
  countries,
  setCountries,
  editData,
  setEditData,
  setAreas,
}) => {
  const icon = <CheckBoxOutlineBlankIcon fontSize="small" />;
  const checkedIcon = <CheckBoxIcon fontSize="small" />;
  const initialData = { name: "", description: "", Country: null, Images: [] };
  const [area, setArea] = useState(editData || initialData);
  const [loading, setLoading] = useState(false);

  const onSubmit = (e) => {
    e.preventDefault();
    if (area.name === "" && area.country === null) {
      return setError("Complete the area name field and select a country");
    } else if (area.name === "") {
      return setError("Complete the area name field");
    } else if (area.Country === null) {
      return setError("Select a country");
    }
    setLoading(true);

    const formData = new FormData();

    area.Images.forEach((element) => {
      formData.append("image", element);
    });

    if (editData) {
      updatelocation({ type: "area", ...area })
        .then((data) => {
          if (!data.ok) {
            setOpen(false);
            return setError(data.message);
          }
          setImages({ id: editData.id, type: "area" }, formData).then(() => {
            if (!data.ok) {
              setOpen(false);
              return setError(data.message);
            }
          });
          setAreas((prev) =>
            prev.map((item) => (item.id === editData.id ? area : item))
          );
          setOpen(false);
          setMessage(data.message);
          refreshData();
        })
        .finally(() => {
          setLoading(false);
        });
    } else {
      newArea(area)
        .then((data) => {
          if (!data.ok) {
            setOpen(false);
            return setError(data.message);
          }
          setImages({ id: data.body.newArea.id, type: "area" }, formData).then(
            (data2) => {
              if (!data2.ok) {
                setOpen(false);
                return setError(data2.message);
              }
            }
          );
          setOpen(false);
          setMessage(data.message);
          refreshData();
        })
        .finally(() => {
          setLoading(false);
        });
    }
    setArea({ name: "", description: "", idCountry: null });
  };
  const handleChange = (e) => {
    const { name, value } = e.target;
    setArea((prevData) => ({
      ...prevData,
      [name]: value,
    }));
    setError(null);
  };

  useEffect(() => {
    if (countries.length === 0) {
      admin.getCountries().then((data) => setCountries(data.body.countries));
    }
  }, []);

  const onClose = () => {
    setArea(initialData);
    setEditData(null);
    return setOpen();
  };

  return (
    <BasicModal
      open={open}
      setOpen={onClose}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <div className="absolute flex flex-col items-center justify-center px-12 py-8 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-main-100 dark:bg-main-900 rounded-lg gap-4">
        <h3 className="text-2xl text-main-0 dark:text-main-1000 font-bold">
          {editData ? "Edit" : "Add"} Area
        </h3>
        <form
          onSubmit={onSubmit}
          className="flex flex-col w-full gap-4 items-center"
        >
          <div className="flex gap-4">
            <TextField
              label="Area name"
              name="name"
              value={area.name}
              onChange={handleChange}
              fullWidth
            />
            <FormControl sx={{ width: 300 }}>
              <Autocomplete
                multiple={false}
                sx={{ width: 300, maxWidth: "100%" }}
                id={`id-countries`}
                options={countries}
                value={area.Country}
                onChange={(e, newValue) => {
                  setArea((prev) => ({ ...prev, Country: newValue }));
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
                    label={"Select Country"}
                    placeholder={"Countries"}
                  />
                )}
              />
            </FormControl>
          </div>
          <TextField
            label="Area description"
            name="description"
            value={area.description}
            onChange={handleChange}
            multiline
            rows={10}
            fullWidth
          />
          <UploadImage
            currentImages={editData?.Images || []}
            setEditData={setArea}
          />
          <button className="button" type="submit" disabled={loading}>
            {loading ? (
              <CircularProgress />
            ) : editData ? (
              "Edit Area"
            ) : (
              "Add Area"
            )}
          </button>
        </form>
      </div>
    </BasicModal>
  );
};

export default AddAreaModal;
