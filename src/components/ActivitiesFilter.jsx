import {
  Badge,
  FormControl,
  InputLabel,
  MenuItem,
  OutlinedInput,
  Select,
} from "@mui/material";
import { useEffect } from "react";

const ActivitiesFilter = ({
  activities = [],
  selectedActivities,
  handleActivitySelection,
  initialActivityId,
}) => {
  useEffect(() => {
    if (initialActivityId) {
      handleActivitySelection(initialActivityId);
    }
    // handleActivitySelection toggles selection and is redefined every render in the
    // parent (not memoized); including it here would re-fire on every render and
    // flip the selection on/off in a loop
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialActivityId]);

  const handleChange = (event) => {
    const value = event.target.value;

    // Si es multiple devuelve array, si no devuelve string
    if (Array.isArray(value)) {
      value.forEach((id) => handleActivitySelection(id));
    } else {
      handleActivitySelection(value);
    }
  };

  return (
    <FormControl fullWidth size="small">
      <InputLabel id="activities-select-label">Activities Provided</InputLabel>

      <Select
        labelId="activities-select-label"
        value={selectedActivities}
        onChange={handleChange}
        input={<OutlinedInput label="Activities Provided" />}
        renderValue={(selected) =>
          activities
            .filter((a) => selected.includes(a.id))
            .map((a) => a.name)
            .join(", ")
        }
        className="bg-main-100 dark:bg-main-900 text-left"
      >
        {activities.map((activity) => (
          <MenuItem
            key={activity.id}
            value={activity.id}
            sx={{
              "&.Mui-selected": { backgroundColor: "#D6ECFA" },
              "&.Mui-selected:hover": { backgroundColor: "#C2E2F7" },
              "&:hover": { backgroundColor: "#FCE1F1" },
              "&.Mui-focusVisible": { backgroundColor: "#FCE1F1" },
              "&.Mui-selected.Mui-focusVisible": { backgroundColor: "#C2E2F7" },
              "html.dark &.Mui-selected": { backgroundColor: "#1E4A63" },
              "html.dark &.Mui-selected:hover": { backgroundColor: "#256080" },
              "html.dark &:hover": { backgroundColor: "#5A2A4C" },
              "html.dark &.Mui-focusVisible": { backgroundColor: "#5A2A4C" },
              "html.dark &.Mui-selected.Mui-focusVisible": { backgroundColor: "#256080" },
            }}
          >
            <div className="flex items-center justify-between w-full">
              <span>{activity.name}</span>

              <Badge
                badgeContent={activity.count}
                color="primary"
                classes={{ badge: "!text-main-1000" }}
              />
            </div>
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
};

export default ActivitiesFilter;
