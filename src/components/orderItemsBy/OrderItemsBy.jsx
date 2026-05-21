import { FormControl, InputLabel, MenuItem, Select } from "@mui/material";
import styles from "./orderItemsBy.module.css";
import { useState } from "react";

export default function OrderItemsBy({ setItems }) {
  const [value, setValue] = useState("Most Recently");

  return (
    <div className={styles.container}>
      <FormControl sx={{ m: 1, minWidth: 120 }} size="small">
        <InputLabel id="demo-select-small-label">Order by</InputLabel>
        <Select
          labelId="demo-select-small-label"
          id="demo-select-small"
          value={value}
          label={`Order by`}
          onChange={(e) => setValue(e.target.value)}
        >
          <MenuItem value={"Most Recently"}>Most Recently</MenuItem>
          {/* <MenuItem value={"Most Relevant"}>Most Relevant</MenuItem> */}
          <MenuItem value={"Higher Price"}>Higher Price</MenuItem>
          <MenuItem value={"Lower Price"}>Lower Price</MenuItem>
        </Select>
      </FormControl>
    </div>
  );
}
