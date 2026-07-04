import  { useState, useEffect } from "react";
import { Autocomplete, Checkbox, FormControl, TextField } from "@mui/material";
import CheckBoxOutlineBlankIcon from "@mui/icons-material/CheckBoxOutlineBlank";
import CheckBoxIcon from "@mui/icons-material/CheckBox";
import BasicModal from "@/components/basicModal/BasicModal";
import newRegion from "@/services/newRegion";
import updatelocation from "@/services/updateLocation";
import admin from "@/services/admin";

const AddRegionModal = ({
  open,
  setOpen,
  refreshData,
  setError,
  areas,
  setAreas,
  setMessage,
  editData,
  setEditData,
  setRegions,
}) => {
  const icon = <CheckBoxOutlineBlankIcon fontSize="small" />;
  const checkedIcon = <CheckBoxIcon fontSize="small" />;
  const initialData = {
    name: "",
    description: "",
    areas: [],
  };
  const [region, setRegion] = useState(editData || initialData);

  useEffect(() => {
    if (areas.length === 0) {
      admin.getAreas().then((data) => setAreas(data.body.areas));
    }
  }, []);
  const onSubmit = (e) => {
    e.preventDefault();

    if (region.name === "" && region.areas.length === 0) {
      return setError("Complete the region name field and select a area");
    } else if (region.name === "") {
      return setError("Complete the region name field");
    } else if (region.areas.length === 0) {
      return setError("Select at least one area");
    }

    if (editData) {
      updatelocation({ type: "region", ...region }).then((data) => {
        if (!data.ok) {
          setOpen(false);
          return setError(data.message);
        }
        setOpen(false);
        setMessage(data.message);
        refreshData();
      });
    } else {
      newRegion(region).then((data) => {
        if (!data.ok) {
          return setError(data.message);
        }
        setOpen(false);
        setMessage(data.message);
        refreshData();
      });
    }
    setRegion({ name: "", description: "", areas: [] });
  };
  const handleChange = (e) => {
    const { name, value } = e.target;
    setRegion((prevData) => ({
      ...prevData,
      [name]: value,
    }));
    setError(null);
  };

  const onClose = () => {
    setRegion(initialData);
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
          {editData ? "Edit" : "Add"} Region
        </h3>
        <form
          onSubmit={onSubmit}
          className="flex flex-col w-full gap-4 items-center"
        >
          <div style={{ display: "flex", gap: "10px" }}>
            <TextField
              label="Region name"
              name="name"
              value={region.name}
              onChange={handleChange}
              sx={{ width: 300 }}
            />

            <FormControl sx={{ width: 300 }}>
              <Autocomplete
                multiple={true}
                sx={{ width: 300, maxWidth: "100%" }}
                id={`id-countries`}
                options={areas}
                value={region.areas}
                onChange={(e, newValue) => {
                  setRegion((prev) => ({ ...prev, areas: newValue }));
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
            label="Region description"
            name="description"
            value={region.description}
            onChange={handleChange}
            multiline
            rows={10}
            sx={{ width: 610 }}
          />
          <button
            className="button"
            type="submit"
          >
            {editData ? "Edit" : "Add"}
          </button>
        </form>
      </div>
    </BasicModal>
  );
};

export default AddRegionModal;
