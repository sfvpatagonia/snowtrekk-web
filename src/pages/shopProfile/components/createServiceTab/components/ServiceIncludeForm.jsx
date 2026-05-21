import {
  Checkbox,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  TextField,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { useEffect, useState } from "react";
import languagesEntities from "@/services/languagesEntities";

export default function ServiceIncludeForm({
  newService,
  setNewService,
  includes,
  setIncludes,
  notIncludes,
  setNotIncludes,
  handleChange,
  loading,
}) {
  const [languages, setLanguages] = useState([]);
  const handleAddToList = (event, name) => {
    event.preventDefault();

    if (newService[name] === "") return;

    if (name === "includes") {
      setIncludes([...includes, newService.includes]);
      setNewService((prevService) => ({ ...prevService, includes: "" }));
    } else {
      setNotIncludes([...notIncludes, newService.notIncludes]);
      setNewService((prevService) => ({ ...prevService, notIncludes: "" }));
    }
  };

  useEffect(() => {
    languagesEntities.get().then((data) => setLanguages(data.body.languages));
  }, []);

  return (
    <>
      <div className="flex flex-col md:flex-row w-full justify-between gap-4 min-w-[300px] px-8">
        <FormControl className="w-full md:w-1/2">
          <InputLabel id="paymentMethod-label">
            Accepted payment methods
          </InputLabel>
          <Select
            labelId="paymentMethod-label"
            id="paymentMethod-select"
            value={newService.paymentMethod ? newService.paymentMethod : []}
            name="paymentMethod"
            label="Accepted payment methods"
            onChange={handleChange}
            multiple
          >
            <MenuItem value="cash">Cash</MenuItem>
            <MenuItem value="credit">Credit Card</MenuItem>
            <MenuItem value="transfer">Bank Transfer</MenuItem>
            <MenuItem value="wallet">Virtual Wallet</MenuItem>
          </Select>
        </FormControl>
        <FormControl className="w-full md:w-1/2">
          <InputLabel id="cancellation-label">Cancellation</InputLabel>
          <Select
            labelId="cancellation-label"
            id="cancellation-select"
            value={
              newService.cancellationPolicy
                ? newService.cancellationPolicy
                : newService.cancellation
            }
            name="cancellation"
            label="Cancellation"
            onChange={handleChange}
          >
            <MenuItem value="Flexible">Flexible</MenuItem>
            <MenuItem value="No">No</MenuItem>
            <MenuItem value="1 month">1 month before</MenuItem>
            <MenuItem value="1 week">1 week before</MenuItem>
          </Select>
        </FormControl>
      </div>
      <div className="flex flex-col md:flex-row w-full justify-between gap-4 min-w-[300px] px-8">
        <div className="flex justify-between w-full md:w-1/2 items-center">
          <div className="flex flex-col w-1/2">
            <Checkbox
              checked={newService.transporIncluded}
              onClick={() =>
                setNewService({
                  ...newService,
                  transporIncluded: !newService.transporIncluded,
                })
              }
            />
            <p id="transport-checkbox-label">Transport included</p>
          </div>
          <TextField
            label="Transport price"
            className="w-full md:w-1/2"
            name="transport"
            type="number"
            value={newService.transport}
            disabled={loading || newService.transporIncluded}
            onChange={handleChange}
          />
        </div>
        <FormControl className="w-full md:w-1/2">
          <InputLabel id="languages-label">Languages</InputLabel>
          <Select
            labelId="languages-label"
            multiple
            id="languages-select"
            value={newService.languages ? newService.languages : []}
            name="languages"
            label="languages"
            onChange={handleChange}
          >
            {languages.map((language) => (
              <MenuItem value={language.name} key={language.id}>
                {language.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </div>
      <div className="flex flex-col md:flex-row  w-full justify-between gap-4 min-w-[300px] px-8">
        <div className="flex flex-col w-full md:w-1/2 items-center">
          <div className="flex w-full gap-4">
            <TextField
              label="Includes"
              name="includes"
              value={newService.includes}
              type="text"
              className="w-full md:w-1/2"
              disabled={loading}
              sx={{ width: "100%" }}
              onChange={handleChange}
            />
            <button
              className="button"
              onClick={(e) => handleAddToList(e, "includes")}
            >
              Add
            </button>
          </div>
          {includes.length > 0 && (
            <ul className="flex flex-col gap-2 p-4 border border-main-100 dark:border-main-900 bg-main-50 dark:bg-main-950 w-full border-t-0 rounded-b">
              {includes.map((item, index) => (
                <li
                  className="flex justify-between items-center p-2 bg-main-100 dark:bg-main-900"
                  key={index}
                >
                  <span>{item}</span>
                  <CloseIcon
                    onClick={() =>
                      setIncludes(includes.filter((_, i) => i !== index))
                    }
                    className="p-0.5 duration-300 ease-in hover:text-main-600 cursor-pointer hover:dark:text-main-400"
                  />
                </li>
              ))}
            </ul>
          )}
        </div>
        <div className="flex flex-col w-full md:w-1/2 items-center">
          <div className="flex w-full gap-4">
            <TextField
              label="Not Includes"
              name="notIncludes"
              type="text"
              value={newService.notIncludes}
              disabled={loading}
              className="w-full md:w-1/2"
              sx={{ width: "100%" }}
              onChange={handleChange}
            />
            <button
              className="button"
              onClick={(e) => handleAddToList(e, "notIncludes")}
            >
              Add
            </button>
          </div>
          {notIncludes.length > 0 && (
            <ul className="flex flex-col gap-2 p-4 border border-main-100 dark:border-main-900 bg-main-50 dark:bg-main-950 w-full border-t-0 rounded-b">
              {notIncludes.map((item, index) => (
                <li
                  className="flex justify-between items-center p-2 bg-main-100 dark:bg-main-900"
                  key={index}
                >
                  <span>{item}</span>
                  <CloseIcon
                    onClick={() =>
                      setNotIncludes(notIncludes.filter((_, i) => i !== index))
                    }
                    className="p-0.5 duration-300 ease-in hover:text-main-600 cursor-pointer hover:dark:text-main-400"
                  />
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </>
  );
}
