import { useEffect, useState } from "react";
import {
  Autocomplete,
  Checkbox,
  CircularProgress,
  FormControl,
  TextField,
} from "@mui/material";
import newDestination from "@/services/newDestination";
import CheckBoxOutlineBlankIcon from "@mui/icons-material/CheckBoxOutlineBlank";
import CheckBoxIcon from "@mui/icons-material/CheckBox";
import admin from "@/services/admin";
import UploadImage from "@/components/UploadImage";
import BasicModal from "@/components/basicModal/BasicModal";
import updatelocation from "@/services/updateLocation";
import setImages from "@/services/setImages";

const AddDestinationModal = ({
  open,
  setOpen,
  setMessage,
  setError,
  refreshData,
  regions,
  setRegions,
  areas,
  setAreas,
  cities,
  setCities,
  editData,
  setEditData,
  setDestinations,
}) => {
  const initialState = {
    name: "",
    description: "",
    Region: null,
    Area: null,
    cityDestination: [],
    Images: [],
    featured: false,
  };
  const icon = <CheckBoxOutlineBlankIcon fontSize="small" />;
  const checkedIcon = <CheckBoxIcon fontSize="small" />;
  const [destination, setDestination] = useState(editData || initialState);
  const [loading, setLoading] = useState(false);

  const onSubmit = (e) => {
    e.preventDefault();

    if (destination.name === "") {
      return setError("Complete the area name field");
    }
    // if (destination.cities.length === 0) {
    //   return setError("Select at least a city");
    // }

    if (destination.Area && destination.Region) {
      return setError("Select only one area or region");
    }

    if (
      !destination.Area &&
      !destination.Region &&
      destination.cityDestination.length === 0
    ) {
      return setError("Select where the destination is located");
    }
    setLoading(true);

    const formData = new FormData();

    destination.Images.forEach((element) => {
      formData.append("image", element);
    });

    if (editData) {
      updatelocation({ type: "destination", ...destination })
        .then((data) => {
          if (!data.ok) {
            setOpen(false);
            return setError(data.message);
          }
          setImages({ id: editData.id, type: "destination" }, formData).then(
            () => {
              if (!data.ok) {
                setOpen(false);
                return setError(data.message);
              }
            }
          );
          setDestinations((prevDestinations) => {
            return prevDestinations.map((item) => {
              if (item.id === editData.id) {
                return destination;
              }
              return item;
            });
          });
          setOpen(false);
          setMessage(data.message);
          refreshData();
        })
        .finally(() => {
          setLoading(false);
        });
    } else {
      newDestination(destination)
        .then((data) => {
          if (!data.ok) {
            return setError(data.message);
          }
          setImages(
            { id: data.body.newDestination.id, type: "destination" },
            formData
          ).then((data2) => {
            if (!data2.ok) {
              setOpen(false);
              return setError(data2.message);
            }
          });
          setOpen(false);
          setMessage(data.message);
          refreshData();
        })
        .finally(() => {
          setLoading(false);
        });
      setDestination(initialState);
    }
  };
  const handleChange = (e) => {
    const { name, value } = e.target;
    setDestination((prevData) => ({
      ...prevData,
      [name]: value,
    }));
    setError(null);
  };

  useEffect(() => {
    if (areas.length === 0) {
      admin.getAreas().then((data) => setAreas(data.body.areas));
    }

    if (cities.length === 0) {
      admin.getCities().then((data) => setCities(data.body.cities));
    }
    if (regions.length === 0) {
      admin.getRegions().then((data) => setRegions(data.body.regions));
    }
  }, []);

  const onClose = () => {
    setDestination(initialState);
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
          {editData ? "Edit" : "Add"} Destination
        </h3>
        <form
          onSubmit={onSubmit}
          className="flex flex-col w-full items-center gap-4"
        >
          <div className="flex gap-4">
            <TextField
              label="Name"
              name="name"
              value={destination.name}
              onChange={handleChange}
              sx={{ width: 300 }}
            />
            <FormControl sx={{ width: 300 }}>
              <Autocomplete
                multiple={true}
                sx={{ width: 300, maxWidth: "100%" }}
                id={`id-cities`}
                options={cities}
                value={destination.cityDestination}
                isOptionEqualToValue={(option, value) => option.id === value.id}
                disabled={destination.Area || destination.Region}
                onChange={(e, newValue) => {
                  setDestination((prev) => ({
                    ...prev,
                    cityDestination: newValue,
                  }));
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
                    label={"Select Cities"}
                    placeholder={"Cities"}
                  />
                )}
              />
            </FormControl>
          </div>
          <div style={{ display: "flex", gap: "10px" }}>
            <FormControl sx={{ width: 300 }}>
              <Autocomplete
                multiple={false}
                sx={{ width: 300, maxWidth: "100%" }}
                id={`id-areas`}
                options={areas}
                value={destination.Area || null}
                disabled={
                  destination.Region || destination?.cityDestination?.length > 0
                }
                onChange={(e, newValue) => {
                  setDestination((prev) => ({ ...prev, Area: newValue }));
                }}
                isOptionEqualToValue={(option, value) => option.id === value.id}
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
            <FormControl sx={{ width: 300 }}>
              <Autocomplete
                multiple={false}
                sx={{ width: 300, maxWidth: "100%" }}
                id={`id-regions`}
                options={regions}
                value={destination.Region || null}
                disabled={
                  destination.Area || destination.cityDestination?.length > 0
                }
                isOptionEqualToValue={(option, value) => option.id === value.id}
                onChange={(e, newValue) => {
                  setDestination((prev) => ({ ...prev, Region: newValue }));
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
                    label={"Select Region"}
                    placeholder={"Regions"}
                  />
                )}
              />
            </FormControl>
          </div>
          <li className="flex w-[300px] items-center justify-start border p-2 rounded border-main-1000/20 text-main-0 dark:text-main-1000">
            <Checkbox
              checked={destination.featured}
              icon={icon}
              checkedIcon={checkedIcon}
              disabled={loading}
              onChange={() =>
                setDestination((prev) => ({
                  ...prev,
                  featured: !prev.featured,
                }))
              }
            />
            is Featured?
          </li>

          <TextField
            label="Description"
            name="description"
            value={destination.description}
            onChange={handleChange}
            multiline
            rows={10}
            fullWidth
          />
          <UploadImage
            currentImages={editData?.Images || []}
            setEditData={setDestination}
          />
          <button
            className="button"
            type="submit"
          >
            {loading ? (
              <CircularProgress />
            ) : editData ? (
              "Edit Destination"
            ) : (
              "Add Destination"
            )}
          </button>
        </form>
      </div>
    </BasicModal>
  );
};

export default AddDestinationModal;
