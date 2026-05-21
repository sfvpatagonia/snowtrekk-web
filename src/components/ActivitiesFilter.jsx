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
  activities,
  selectedActivities,
  handleActivitySelection,
  initialActivityId,
}) => {
  useEffect(() => {
    if (initialActivityId) {
      handleActivitySelection(initialActivityId);
    }

    if (
      activities.some((a) => a.id === "beddb246-fd1e-11ee-b212-d8fb5ec87fe9")
    ) {
      handleActivitySelection("beddb246-fd1e-11ee-b212-d8fb5ec87fe9");
    }
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
          <MenuItem key={activity.id} value={activity.id}>
            <div
              className={`flex items-center justify-between w-full ${
                selectedActivities.includes(activity.id)
                  ? "bg-main-100 dark:bg-main-900 !text-main-0 dark:!text-main-1000"
                  : ""
              } `}
            >
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
