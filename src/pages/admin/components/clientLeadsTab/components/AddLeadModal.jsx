import { useEffect, useState } from "react";
import {
  Autocomplete,
  Checkbox,
  Chip,
  CircularProgress,
  FormControl,
  TextField,
} from "@mui/material";
import { useDispatch } from "react-redux";
import CheckBoxOutlineBlankIcon from "@mui/icons-material/CheckBoxOutlineBlank";
import CheckBoxIcon from "@mui/icons-material/CheckBox";
import admin from "@/services/admin";
import BasicModal from "@/components/basicModal/BasicModal";
import languagesEntities from "@/services/languagesEntities";
import newLead from "@/services/newLead";
import updateLead from "@/services/updateLead";

const AddLeadModal = ({
  open,
  setOpen,
  setMessage,
  setError,
  destinations,
  setDestinations,
  editData,
  setEditData,
  activities,
  setActivities,
  setLeads,
}) => {
  const initialState = {
    companyName: "",
    responsableName: "",
    email: "",
    facebook: "",
    instagram: "",
    phone: "",
    youtube: "",
    website: "",
    tiktok: "",
    isVisible: true,
    isClient: false,
    x: "",
    languages: [],
    clientDestinations: [],
    clientActivities: [],
    location: "",
  };
  const icon = <CheckBoxOutlineBlankIcon fontSize="small" />;
  const checkedIcon = <CheckBoxIcon fontSize="small" />;
  const [lead, setLead] = useState(editData || initialState);
  const [loading, setLoading] = useState(false);
  const [languages, setLanguages] = useState([]);
  // const { destinations, status: destinationStatus } = useSelector(
  //   (state) => state.destinations
  // );

  const onSubmit = (e) => {
    e.preventDefault();

    if (lead.name === "") {
      return setError("Complete the area name field");
    }
    if (lead.email === "") {
      return setError("Complete the email field");
    }

    setLoading(true);

    if (editData) {
      updateLead(lead)
        .then((data) => {
          if (!data.ok) {
            setOpen(false);
            return setError(data.message);
          }
          setLeads((prevLeads) => {
            return prevLeads.map((item) => {
              if (item.id === editData.id) {
                return lead;
              }
              return item;
            });
          });
          setOpen(false);
          setMessage(data.message);
        })
        .finally(() => {
          setLoading(false);
          setLead(initialState);
        });
    } else {
      newLead(lead)
        .then((data) => {
          if (!data.ok) {
            return setError(data.message);
          }
          setLoading(false);
          setMessage(data.message);
          setOpen(false);
          setLeads((prevLeads) => [data.body.newLead, ...prevLeads]);
        })
        .finally(() => {
          setLead(initialState);
        });
    }
  };
  const handleChange = (e) => {
    const { name, value } = e.target;
    setLead((prevData) => ({
      ...prevData,
      [name]: value,
    }));
    setError(null);
  };

  const sortedList = (list) =>
    list.sort((a, b) => {
      let nameA = "";
      if (a.idArea) {
        nameA = a.Area.Country.name;
      } else if (a.idRegion) {
        nameA = a.Region.areas[0].Country.name;
      } else {
        nameA = a.cityDestination[0]?.Area.Country.name;
      }

      let nameB = "";
      if (b.idArea) {
        nameB = b.Area.Country.name;
      } else if (b.idRegion) {
        nameB = b.Region.areas[0].Country.name;
      } else {
        nameB = b.cityDestination[0].Area.Country.name;
      }

      if (nameA < nameB) {
        return -1;
      }
      if (nameA > nameB) {
        return 1;
      }
      return 0;
    });

  useEffect(() => {
    setLoading(true);
    admin.getActivities().then((data) => setActivities(data.body.activities));
    admin.getDestinations().then((data) => {
      const sortedDestinations = sortedList(data.body.destinations);
      setDestinations(sortedDestinations);
    });
    languagesEntities.get().then((data) => setLanguages(data.body.languages));
    setLoading(false);
  }, []);

  const dispatch = useDispatch();

  // useEffect(() => {
  //   if (destinationStatus === "idle") {
  //     dispatch(fetchDestinations());
  //     console.log("fetch");
  //   } else {
  //     console.log(destinationStatus);
  //   }
  // }, [destinationStatus, dispatch]);

  const onClose = () => {
    setLead(initialState);
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
      <div className="absolute flex flex-col max-h-[90vh] gap-4 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 lg:w-[1000px] md:w-[700px] sm:w-[540px] w-[300px]  !bg-main-100 dark:!bg-main-900 shadow-lg p-8 rounded-lg items-center justify-start overflow-y-auto">
        <h3 className="text-main-0 dark:text-main-1000">
          {editData ? "Edit" : "Add"} Destination
        </h3>
        <form
          onSubmit={onSubmit}
          className="flex flex-col w-full items-center gap-4"
        >
          <div className="flex w-full gap-2.5 flex-wrap items-center justify-center">
            <TextField
              label="Company Name"
              name="companyName"
              value={lead.companyName}
              onChange={handleChange}
              disabled={loading}
              sx={{ width: 300 }}
            />
            <TextField
              label="Phone"
              name="phone"
              value={lead.phone}
              onChange={handleChange}
              disabled={loading}
              sx={{ width: 300 }}
            />

            <TextField
              label="E-mail"
              name="email"
              value={lead.email}
              disabled={loading}
              onChange={handleChange}
              sx={{ width: 300 }}
            />
            <TextField
              label="Responsable Name"
              name="responsableName"
              value={lead.responsableName}
              onChange={handleChange}
              disabled={loading}
              sx={{ width: 300 }}
            />
            <TextField
              label="Website"
              name="website"
              value={lead.website}
              onChange={handleChange}
              disabled={loading}
              sx={{ width: 300 }}
            />
            <TextField
              label="Instagram"
              name="instagram"
              value={lead.instagram}
              onChange={handleChange}
              disabled={loading}
              sx={{ width: 300 }}
            />
            <TextField
              label="Facebook"
              name="facebook"
              value={lead.facebook}
              onChange={handleChange}
              disabled={loading}
              sx={{ width: 300 }}
            />
            <TextField
              label="TikTok"
              name="tiktok"
              value={lead.tiktok}
              onChange={handleChange}
              disabled={loading}
              sx={{ width: 300 }}
            />
            <TextField
              label="Youtube"
              name="youtube"
              value={lead.youtube}
              onChange={handleChange}
              disabled={loading}
              sx={{ width: 300 }}
            />
            <TextField
              label="X"
              name="x"
              value={lead.x}
              onChange={handleChange}
              disabled={loading}
              sx={{ width: 300 }}
            />
            <TextField
              label="Location instructions"
              name="location"
              value={lead.location}
              onChange={handleChange}
              disabled={loading}
              maxLength={255}
              sx={{ width: 300 }}
            />
            <li className="flex w-[300px] items-center justify-start border p-2 rounded border-main-1000/20 text-main-0 dark:text-main-1000">
              <Checkbox
                checked={lead.isClient}
                icon={icon}
                checkedIcon={checkedIcon}
                disabled={loading}
                onChange={() =>
                  setLead((prev) => ({
                    ...prev,
                    isClient: !prev.isClient,
                  }))
                }
              />
              is Client?
            </li>
          </div>
          <div className="flex w-full gap-2.5 flex-wrap items-center justify-center">
            <TextField
              label="Notes"
              name="notes"
              value={lead.notes}
              onChange={handleChange}
              disabled={loading}
              multiline
              rows={5}
              fullWidth
              sx={{ padding: "7.5px" }}
            />
          </div>
          <div className="flex w-full gap-2.5 flex-wrap items-center justify-center">
            <FormControl sx={{ width: 300 }}>
              <Autocomplete
                multiple={true}
                sx={{ width: 300 }}
                id={`id-activities`}
                options={activities}
                value={lead.clientActivities}
                disabled={loading}
                disableCloseOnSelect
                limitTags={1}
                renderTags={(value, getTagProps) => (
                  <Chip
                    {...getTagProps}
                    variant="filled"
                    label={value.length}
                  />
                )}
                onChange={(e, newValue) => {
                  setLead((prev) => ({
                    ...prev,
                    clientActivities: newValue,
                  }));
                }}
                ListboxProps={{
                  style: {
                    textAlign: "left",
                  },
                }}
                loading={loading}
                isOptionEqualToValue={(option, value) =>
                  option?.id === value?.id
                }
                getOptionLabel={(option) => option?.name}
                renderOption={(props, option, { selected }) => {
                  const { key, ...optionProps } = props;
                  return (
                    <li key={option?.id} {...optionProps}>
                      <Checkbox
                        icon={icon}
                        checkedIcon={checkedIcon}
                        style={{ marginRight: 8 }}
                        checked={selected}
                      />
                      {option?.name}
                    </li>
                  );
                }}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label={"Select Activities"}
                    placeholder={"Activities"}
                  />
                )}
              />
            </FormControl>
            <FormControl sx={{ width: 300 }}>
              <Autocomplete
                multiple={true}
                sx={{ width: 300, maxWidth: "100%" }}
                id={`id-destinations`}
                options={destinations}
                value={lead.clientDestinations}
                disabled={loading}
                ListboxProps={{
                  style: {
                    textAlign: "left",
                  },
                }}
                isOptionEqualToValue={(option, value) => option.id === value.id}
                onChange={(e, newValue) => {
                  setLead((prev) => ({
                    ...prev,
                    clientDestinations: newValue,
                  }));
                }}
                getOptionLabel={(option) => option.name}
                disableCloseOnSelect
                groupBy={(option) => {
                  if (option.idArea) {
                    return option.Area.Country.name;
                  }
                  if (option.idRegion) {
                    return option.Region.areas[0].Country.name;
                  }
                  return option.cityDestination[0]?.Area.Country.name;
                }}
                renderTags={(value, getTagProps) => (
                  <Chip
                    {...getTagProps}
                    variant="filled"
                    label={value.length}
                  />
                )}
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
                    label={"Select Destinations"}
                    placeholder={"Destinations"}
                  />
                )}
              />
            </FormControl>
            <FormControl sx={{ width: 300 }}>
              <Autocomplete
                multiple={true}
                sx={{ width: 300, maxWidth: "100%" }}
                id={`id-languages`}
                options={languages}
                value={lead.languages || []}
                disabled={loading}
                disableCloseOnSelect
                limitTags={1}
                ListboxProps={{
                  style: {
                    textAlign: "left",
                  },
                }}
                renderTags={(value, getTagProps) => (
                  <Chip
                    {...getTagProps}
                    variant="filled"
                    label={value.length}
                  />
                )}
                isOptionEqualToValue={(option, value) => option.id === value.id}
                onChange={(e, newValue) => {
                  setLead((prev) => ({
                    ...prev,
                    languages: newValue,
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
                    label={"Select Languages"}
                    placeholder={"Languages"}
                  />
                )}
              />
            </FormControl>
          </div>
          <button className="button" type="submit" disabled={loading}>
            {loading ? (
              <CircularProgress sx={{ color: "white" }} size={20} />
            ) : editData ? (
              "Edit Lead"
            ) : (
              "Add Lead"
            )}
          </button>
        </form>
      </div>
    </BasicModal>
  );
};

export default AddLeadModal;
