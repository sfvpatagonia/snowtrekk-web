import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker as DP } from "@mui/x-date-pickers/DatePicker";
import dayjs from "dayjs";

export default function DatePicker({ selectedDate, setSelectedDate,availableDates }) {
  const defaultValue = dayjs(new Date());

    const availableDays = new Set(
      availableDates.flatMap((a) =>
        a.turnosDisponibles
          .filter((t) => t.libre > 0)
          .map((t) => dayjs(t.startAt).format("YYYY-MM-DD"))
      )
    );

      const shouldDisableDate = (date) => {
    const formatted = date.format("YYYY-MM-DD");
    return !availableDays.has(formatted);
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <DP
        defaultValue={defaultValue}
        format="DD/MM/YYYY"
        onChange={(e) => setSelectedDate({ date: e.$d, time: null })}
        disablePast
        shouldDisableDate={shouldDisableDate}
        slotProps={{
         day: {
              classes: {
                selected : "!bg-main-600 dark:!bg-main-400"
              }
            },
          field: {
            classes: {
              root: "text-main-0 dark:text-main-1000 hover:bg-green-200 hover:dark:bg-green-800",
            },
          },
          calendarHeader: {
            slotProps: {
              switchViewIcon: {
                classes: {
                  root: "text-main-600 dark:text-main-400 hover:text-green-700 hover:dark:text-main-green-500",
                },
              },
              leftArrowIcon: {
                classes: {
                  root: "text-main-600 dark:text-main-400 hover:text-green-700 hover:dark:text-main-green-500",
                },
              },
              rightArrowIcon: {
                classes: {
                  root: "text-main-600 dark:text-main-400 hover:text-green-700 hover:dark:text-main-green-500",
                },
              },
            },
          },
        }}
      />
    </LocalizationProvider>
  );
}
