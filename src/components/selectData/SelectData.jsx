import Box from "@mui/material/Box";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import "./selectData.css";

const SelectData = ({ items, data, setData }) => {
  const handleChange = (event) => {
    setData(event.target.value);
  };

  return (
    <Box sx={{ minWidth: 120 }}>
      <FormControl sx={{ width: "60%" }} size="small">
        <Select
          value={data}
          onChange={handleChange}
          inputProps={{ "aria-label": "Without label" }}
        >
          {items.map((item, index) => {
            return (
              <MenuItem value={item} key={index}>
                {item}
              </MenuItem>
            );
          })}
        </Select>
      </FormControl>
    </Box>
  );
};

export default SelectData;
