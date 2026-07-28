import OutlinedInput from "@mui/material/OutlinedInput";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import ListItemText from "@mui/material/ListItemText";
import Select from "@mui/material/Select";
import Checkbox from "@mui/material/Checkbox";

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
};

export default function MultiSelect({ values, list, handleChange, field }) {
  return (
    <FormControl sx={{ width: 300 }}>
      <InputLabel id={`${field}-label`}>
        {field.charAt(0).toUpperCase() + field.slice(1)}
      </InputLabel>
      <Select
        labelId={`${field}-label`}
        id={`${field}-multiple-checkbox`}
        multiple
        name={field}
        value={values}
        onChange={handleChange}
        input={
          <OutlinedInput
            label={field.charAt(0).toUpperCase() + field.slice(1)}
          />
        }
        renderValue={(selected) => selected.join(", ")}
        MenuProps={MenuProps}
      >
        {list.map((item) => (
          <MenuItem key={item.name} value={item.name}>
            <Checkbox checked={values.indexOf(item.name) > -1} />
            <ListItemText primary={item.name} />
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
}
