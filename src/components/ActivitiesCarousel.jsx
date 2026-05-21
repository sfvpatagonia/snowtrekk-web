import { Badge } from "@mui/material";
import { useEffect } from "react";

const ActivitiesCarousel = ({
  activities,
  selectedActivities,
  handleActivitySelection,
  initialActivityId,
}) => {
  useEffect(() => {
    if (initialActivityId) {
      handleActivitySelection(initialActivityId);
    }
  }, [initialActivityId]);

  return (
    <div className="flex overflow-x-auto max-w-full">
      {activities.map((activity) => (
        <div
          key={activity.id}
          className={`flex shrink-0 basis-auto m-2 cursor-pointer items-center ${
            selectedActivities.includes(activity.id) &&
            "bg-main-500 dark:bg-main-300 !text-main-1000"
          }
          border-b border-l border-main-600 rounded-xl bg-main-100 dark:bg-main-900 text-sm p-2
          hover:bg-green-500 dark:hover:bg-green-800 duration-200 ease-in
          `}
          onClick={() => handleActivitySelection(activity.id)}
        >
          <Badge
            badgeContent={activity.count}
            color="primary"
            classes={{ badge: "!text-main-1000 -mr-3" }}
          >
            <p className="text-main-0 dark:text-main-1000">{activity.name}</p>
          </Badge>
        </div>
      ))}
    </div>
  );
};

export default ActivitiesCarousel;
