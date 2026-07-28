import {
  Autocomplete,
  Checkbox,
  Chip,
  FormControl,
  TextField,
} from "@mui/material";
import CheckBoxIcon from "@mui/icons-material/CheckBox";
import CheckBoxOutlineBlankIcon from "@mui/icons-material/CheckBoxOutlineBlank";
import { useEffect, useState } from "react";
import getDestinationsName from "@/services/getDestinationsName";
import getActivities from "@/services/getActivities";

export default function ServiceDestinationsForm({
  newService,
  setNewService,
  loading,
}) {
  const icon = <CheckBoxOutlineBlankIcon fontSize="small" />;
  const checkedIcon = <CheckBoxIcon fontSize="small" />;
  const [destinations, setDestinations] = useState([]);
  const [activities, setActivities] = useState([]);

  useEffect(() => {
    getDestinationsName().then((data) =>
      setDestinations(data.body.destinationsNames)
    );
    getActivities().then((data) => setActivities(data.body.activities));
  }, []);

  return (
    <>
      <div className="flex flex-col md:flex-row w-full justify-between gap-4 min-w-[300px] px-8">
        <FormControl className="w-full md:w-1/2">
          <Autocomplete
            sx={{ width: "100%", maxWidth: "100%" }}
            id={`id-categories`}
            options={activities}
            multiple
            limitTags={1}
            renderTags={(value, getTagProps) => (
              <Chip {...getTagProps} variant="filled" label={value.length} />
            )}
            disableCloseOnSelect
            value={newService.categories || []}
            onChange={(e, newValue) => {
              setNewService((prevService) => ({
                ...prevService,
                categories: newValue,
              }));
            }}
            disabled={loading}
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
                label={"Select Categories"}
                placeholder={"Categories"}
                className="w-full md:w-1/2"
              />
            )}
          />
        </FormControl>

        <FormControl className="w-full md:w-1/2">
          <Autocomplete
            sx={{ width: "100%", maxWidth: "100%" }}
            id={`id-destinations`}
            options={destinations}
            multiple
            limitTags={1}
            renderTags={(value, getTagProps) => (
              <Chip {...getTagProps} variant="filled" label={value.length} />
            )}
            disableCloseOnSelect
            value={newService.destinations || []}
            onChange={(e, newValue) => {
              setNewService((prevService) => ({
                ...prevService,
                destinations: newValue,
              }));
            }}
            disabled={loading}
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
                label={"Select Destinations"}
                placeholder={"Destinations"}
                className="w-full md:w-1/2"
              />
            )}
          />
        </FormControl>
      </div>
      <div className="flex flex-col md:flex-row w-full justify-between gap-4 min-w-[300px] px-8">
        <FormControl className="w-full md:w-1/2">
          <Autocomplete
            sx={{ width: "100%", maxWidth: "100%" }}
            id={`id-firstDestination`}
            options={newService.destinations}
            value={newService.firstDestination || null}
            onChange={(e, newValue) => {
              setNewService((prevService) => ({
                ...prevService,
                firstDestination: newValue,
              }));
            }}
            disabled={newService.destinations.length < 2 || loading}
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
                label={"Starts in"}
                placeholder={"Starts in"}
                className="w-full md:w-1/2"
              />
            )}
          />
        </FormControl>
        <FormControl className="w-full md:w-1/2">
          <Autocomplete
            sx={{ width: "100%", maxWidth: "100%" }}
            id={`id-lastdestination`}
            options={newService.destinations}
            limitTags={1}
            renderTags={(value, getTagProps) => (
              <Chip {...getTagProps} variant="filled" label={value.length} />
            )}
            disableCloseOnSelect
            value={newService.lastDestination || null}
            onChange={(e, newValue) => {
              setNewService((prevService) => ({
                ...prevService,
                lastDestination: newValue,
              }));
            }}
            disabled={newService.destinations.length < 2 || loading}
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
                label={"Ends in"}
                placeholder={"Ends in"}
                className="w-full md:w-1/2"
              />
            )}
          />
        </FormControl>
      </div>
    </>
  );
}
