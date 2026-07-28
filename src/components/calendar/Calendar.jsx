import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";

import { DateCalendar } from "@mui/x-date-pickers/DateCalendar";
import { DayCalendarSkeleton } from "@mui/x-date-pickers";

const Calendar = ({ selectedDate, setSelectedDate, availableDates }) => {

  const availableDays = new Set(
    availableDates.flatMap((a) =>
      a.turnosDisponibles
        .filter((t) => t.libre > 0)
        .map((t) => dayjs(t.startAt).format("YYYY-MM-DD"))
    )
  );

  // Deshabilitar fechas que no estén en el array
  const shouldDisableDate = (date) => {
    const formatted = date.format("YYYY-MM-DD");
    return !availableDays.has(formatted);
  };

  // Custom day renderer para aplicar estilos


  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <DateCalendar
        disablePast
        renderLoading={() => <DayCalendarSkeleton />}
        onChange={(e) => setSelectedDate({ date: e.$d, time: null })}
        shouldDisableDate={shouldDisableDate}
        sx={{
          width: "100%",
          maxWidth: "324px",
        }}
        classes={{
          root: "rounded bg-main-100 dark:bg-main-900 text-main-1000 dark:text-main-0",
        }}
        slotProps={
          {
            calendarHeader:{
              classes: {
                label: "text-main-0 dark:text-main-1000"
              },
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
            day: {
              classes: {
                selected : "!bg-main-600 dark:!bg-main-400"
              }
            }
          }
        }

     
      />
    </LocalizationProvider>
  );
};

export default Calendar;
