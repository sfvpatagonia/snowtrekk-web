import { useCallback, useEffect, useMemo } from "react";
import Drawer from "@mui/material/Drawer";
import { useNavigate } from "react-router-dom";
import { Autocomplete, Checkbox, FormGroup, TextField } from "@mui/material";
import CheckBoxOutlineBlankIcon from "@mui/icons-material/CheckBoxOutlineBlank";
import CheckBoxIcon from "@mui/icons-material/CheckBox";
import { ClearIcon } from "@mui/x-date-pickers";
import { useDispatch, useSelector } from "react-redux";
import {
  setSelectedActivity,
  setSelectedArea,
  setSelectedCity,
  setSelectedCountry,
  setSelectedDestination,
  setSelectedRegion,
} from "../redux/guideSlice";

export default function GuideDrawer({ open, setOpen }) {
  const navigate = useNavigate();
  const { activities } = useSelector((state) => state.activities);
  const { destinations } = useSelector((state) => state.destinations);
  const { cities } = useSelector((state) => state.cities);
  const { areas } = useSelector((state) => state.areas);
  const { regions } = useSelector((state) => state.regions);
  const { countries } = useSelector((state) => state.countries);

  const guide = useSelector((state) => state.guide);

  const dispatch = useDispatch();

  const onClose = useCallback(() => {
    setOpen(false);
  }, [setOpen]);

  // =======================
  // HANDLERS
  // =======================

  const handleViewDestination = useCallback(() => {
    let url = "";
    if (guide.selectedDestination)
      url = `/destination/${guide.selectedDestination}`;
    else if (guide.selectedCity) url = `/city/${guide.selectedCity}`;
    else if (guide.selectedArea) url = `/area/${guide.selectedArea}`;
    else if (guide.selectedRegion) url = `/region/${guide.selectedRegion}`;
    else if (guide.selectedCountry) url = `/country/${guide.selectedCountry}`;
    else if (guide.selectedActivity)
      url = `/activity/${guide.selectedActivity}`;

    if (url) navigate(url);
  }, [guide, navigate]);

  // =======================
  // MEMOIZED FILTERS
  // =======================
  const filteredRegions = useMemo(() => {
    if (!guide.selectedCountry) return regions;

    return regions.filter((region) =>
      region.countryIds?.includes(guide.selectedCountry),
    );
  }, [guide.selectedCountry, regions]);

  const filteredAreas = useMemo(() => {
    if (!guide.selectedRegion && !guide.selectedCountry) return areas;

    if (!guide.selectedRegion)
      return areas.filter((area) => area.idCountry === guide.selectedCountry);

    return areas.filter((area) =>
      area.regions?.some((region) => region.id === guide.selectedRegion),
    );
  }, [guide.selectedRegion, guide.selectedCountry, areas]);

  const filteredCities = useMemo(() => {
    if (!guide.selectedArea && !guide.selectedRegion && !guide.selectedCountry)
      return cities;

    if (!guide.selectedArea && !guide.selectedRegion && guide.selectedCountry)
      return cities.filter(
        (city) => city.Area.idCountry === guide.selectedCountry,
      );

    if (!guide.selectedArea && guide.selectedRegion) {
      return cities.filter((city) =>
        city.Area.regions.some((region) => region.id === guide.selectedRegion),
      );
    }

    return cities.filter((city) => city.idArea === guide.selectedArea);
  }, [guide.selectedCountry, guide.selectedRegion, guide.selectedArea, cities]);

  const filteredDestinations = useMemo(() => {
    //Clean
    if (
      !guide.selectedCity &&
      !guide.selectedArea &&
      !guide.selectedRegion &&
      !guide.selectedCountry
    ) {
      return destinations;
    }

    if (
      !guide.selectedCity &&
      !guide.selectedArea &&
      !guide.selectedRegion &&
      guide.selectedCountry
    )
      return destinations.filter(
        (destination) =>
          destination.cityDestination?.some(
            (city) => city.Area?.Country.id === guide.selectedCountry,
          ) ||
          destination.Region?.Country.id === guide.selectedCountry ||
          destination.Area?.idCountry === guide.selectedCountry,
      );

    if (!guide.selectedCity && !guide.selectedArea && guide.selectedRegion)
      return destinations.filter(
        (destination) =>
          destination.idRegion === guide.selectedRegion ||
          destination.Area?.regions?.some(
            (region) => region.id === guide.selectedRegion,
          ) ||
          destinations.cityDestination?.some((city) =>
            city.Area?.regions?.some(
              (region) => region.id === guide.selectedRegion,
            ),
          ),
      );

    if (!guide.selectedCity && guide.selectedArea) {
      return destinations.filter(
        (destination) =>
          destination.idArea === guide.selectedArea ||
          destination.cityDestination?.some(
            (city) => city.idArea === guide.selectedArea,
          ),
      );
    }

    return destinations.filter((destination) =>
      destination.cityDestination.some(
        (city) => city.id === guide.selectedCity,
      ),
    );
  }, [guide, destinations]);

  useEffect(() => {
    if (
      guide.selectedDestination &&
      !guide.selectedCity &&
      !guide.selectedArea &&
      !guide.selectedRegion &&
      !guide.selectedCountry
    ) {
      let destination = destinations.find(
        (destination) => destination.id === guide.selectedDestination,
      );
      let cityId;
      let areaId;
      let regionId;
      let countryId;

      if (
        destination.cityDestination &&
        destination.cityDestination.length > 0
      ) {
        cityId = destination.cityDestination[0].id;
        areaId = destination.cityDestination[0].Area.id;
        let area = destination.cityDestination[0].Area;
        if (area.regions && area.regions.length > 0)
          regionId = area.regions[0].id;
        countryId = area.Country.id;
      }

      if (destination.Area) {
        areaId = destination.Area.id;
        let area = destination.Area;
        if (area.regions && area.regions.length > 0)
          regionId = area.regions[0].id;
        countryId = area.Country.id;
      }
      dispatch(setSelectedCity(cityId));
      dispatch(setSelectedArea(areaId));
      dispatch(setSelectedRegion(regionId));
      dispatch(setSelectedCountry(countryId));
    }

    if (
      guide.selectedCity &&
      !guide.selectedArea &&
      !guide.selectedRegion &&
      !guide.selectedCountry
    ) {
      const city = cities.find((city) => city.id === guide.selectedCity);
      dispatch(setSelectedArea(city.Area.id));
      if (city.Area.regions && city.Area.regions.length > 0) {
        dispatch(setSelectedRegion(city.Area.regions[0].id));
      }
      dispatch(setSelectedCountry(city.Area.idCountry));
    }

    if (guide.selectedArea && !guide.selectedRegion && !guide.selectedCountry) {
      const area = areas.find((area) => area.id === guide.selectedArea);
      if (area.regions && area.regions.length > 0) {
        dispatch(setSelectedRegion(area.regions[0].id));
      }
      dispatch(setSelectedCountry(area.Country.id));
    }

    if (guide.selectedRegion && !guide.selectedCountry) {
      const region = regions.find(
        (region) => region.id === guide.selectedRegion,
      );
      dispatch(setSelectedCountry(region.countryIds[0]));
    }
  }, [guide]);

  // =======================
  // RENDER
  // =======================
  const icon = <CheckBoxOutlineBlankIcon fontSize="small" />;
  const checkedIcon = <CheckBoxIcon fontSize="small" />;
  const SelectComponent = ({ value, label, onChange, options }) => (
    <Autocomplete
      name={`co-select`}
      id={`select-${label.toLowerCase()}`}
      options={options}
      multiple={false}
      value={
        value ? options.find((option) => option.id === value) || null : null
      }
      getOptionLabel={(option) => option?.name || ""}
      clearIcon={
        <ClearIcon
          fontSize="small"
          classes={{ root: "text-main-0 dark:!text-main-1000" }}
        />
      }
      clearText="Any"
      renderOption={(props, option, { selected }) => {
        const { key, ...optionProps } = props;
        return (
          <li key={option.id} {...optionProps} className="text-left">
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
      renderInput={(params) => {
        params.InputLabelProps.className =
          "dark:!text-main-1000 !text-main-0 placeholder:text-main-400";
        return (
          <TextField
            {...params}
            label={`Select ${label}`}
            inputProps={{ ...params.inputProps }}
          />
        );
      }}
      onChange={(e, newValue) => {
        if (!newValue) return onChange("");
        onChange(newValue.id);
      }}
      noOptionsText="There are no options that match your search."
      classes={{
        inputRoot:
          "bg-main-50 dark:bg-main-900 !text-main-0 dark:!text-main-1000",
        labelRoot:
          "bg-main-50 dark:bg-main-900 !text-main-0 dark:!text-main-1000",
        listbox:
          "bg-main-50 dark:bg-main-900 !text-main-0 dark:!text-main-1000",
        option:
          "bg-main-50 dark:bg-main-900 !text-main-0 dark:!text-main-1000 hover:dark:!bg-main-400 focus:dark:bg-main-400 focus:dark:!text-main-1000",
      }}
      sx={{ width: 250 }}
    />
  );

  return (
    <Drawer
      anchor="left"
      open={open}
      onClose={onClose}
      PaperProps={{
        classes: {
          root: "mt-15",
        },
      }}
      ModalProps={{
        classes: {
          hidden: "mt-60",
        },
      }}
    >
      <aside className="flex flex-col h-auto min-h-[calc(100vh-48px)] w-full bg-main-100 dark:bg-main-950 p-8 items-center overflow-y-auto">
        <h2 className="text-xl text-main-400 font-bold">Snowtrekk Directory</h2>
        <p className="text-main-0 dark:text-main-1000 font-bold">
          Search and discover the world
        </p>
        <p className="text-sm text-main-900 dark:text-main-100">
          Each option can be selected or not
        </p>

        <form
          className="flex flex-col items-center justify-between h-full pt-16 w-full mb-20"
          autoComplete="off"
        >
          <FormGroup className="flex flex-col gap-8">
            <SelectComponent
              label="Country"
              value={guide.selectedCountry}
              onChange={(newValue) => {
                dispatch(setSelectedCountry(newValue));
                dispatch(setSelectedArea(""));
                dispatch(setSelectedRegion(""));
                dispatch(setSelectedCity(""));
                dispatch(setSelectedDestination(""));
              }}
              options={countries}
            />
            <SelectComponent
              label="Region"
              value={guide.selectedRegion}
              onChange={(newValue) => {
                dispatch(setSelectedRegion(newValue));
                dispatch(setSelectedArea(""));
                dispatch(setSelectedCity(""));
                dispatch(setSelectedDestination(""));
              }}
              options={filteredRegions}
            />
            <SelectComponent
              label="Area"
              value={guide.selectedArea}
              onChange={(newValue) => {
                dispatch(setSelectedArea(newValue));
                dispatch(setSelectedCity(""));
                dispatch(setSelectedDestination(""));
              }}
              options={filteredAreas}
            />
            <SelectComponent
              label="City"
              value={guide.selectedCity}
              onChange={(newValue) => {
                dispatch(setSelectedCity(newValue));
                dispatch(setSelectedDestination(""));
              }}
              options={filteredCities}
            />
            <SelectComponent
              label="Destination"
              value={guide.selectedDestination}
              onChange={(newValue) => {
                dispatch(setSelectedDestination(newValue));
              }}
              options={filteredDestinations}
            />
            <SelectComponent
              label="Activity"
              value={guide.selectedActivity}
              onChange={(newValue) => dispatch(setSelectedActivity(newValue))}
              options={activities}
            />
          </FormGroup>
          <button onClick={handleViewDestination} className="button mt-8">
            View Location
          </button>
        </form>
      </aside>
    </Drawer>
  );
}
