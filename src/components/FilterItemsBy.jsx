import {
  Autocomplete,
  Checkbox,
  Chip,
  FormControl,
  TextField,
} from "@mui/material";
import CheckBoxOutlineBlankIcon from "@mui/icons-material/CheckBoxOutlineBlank";
import CheckBoxIcon from "@mui/icons-material/CheckBox";
import { ClearIcon } from "@mui/x-date-pickers";
import { useEffect, useState } from "react";
export default function FilterItemsBy({ title, options, filterBy }) {
  const [filter, setFilter] = useState([]);

  useEffect(() => {
    filterBy(filter);
  }, [filter]);

  const icon = <CheckBoxOutlineBlankIcon fontSize="small" />;
  const checkedIcon = <CheckBoxIcon fontSize="small" />;

  return (
    <FormControl className="w-full flex-1">
      <Autocomplete
        name={`co-select`}
        id={`select-${title.toLowerCase()}`}
        options={options}
        multiple={true}
        value={filter}
        clearIcon={
          <ClearIcon
            fontSize="small"
            classes={{ root: "text-main-0 dark:!text-main-1000" }}
          />
        }
        limitTags={1}
        renderTags={(value, getTagProps) => (
          <Chip {...getTagProps} variant="filled" label={value.length} />
        )}
        clearText="Any"
        renderOption={(props, option, { selected }) => {
          const { key, ...optionProps } = props;
          return (
            <li key={key} {...optionProps} className="text-left">
              <Checkbox
                icon={icon}
                checkedIcon={checkedIcon}
                checked={selected}
              />
              {option}
            </li>
          );
        }}
        renderInput={(params) => {
          params.InputLabelProps.className =
            "dark:!text-main-1000 !text-main-0 placeholder:text-main-400";
          return (
            <TextField
              {...params}
              label={`Select ${title}`}
              inputProps={{ ...params.inputProps }}
            />
          );
        }}
        onChange={(e, newValue) => {
          setFilter(newValue);
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
        className="w-full"
      />
    </FormControl>
  );
}
