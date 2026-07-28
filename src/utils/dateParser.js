import { format, isToday } from "date-fns";
import { enUS } from "date-fns/locale";
import { toZonedTime } from "date-fns-tz";

const options = { locale: enUS, timeZone: "" };
export function formatDateMMMMdYYYY(dateString) {
  if (!dateString) return;
  const date = toZonedTime(dateString, "UTC");
  return format(date, "MMMM d, yyyy", { locale: enUS, timeZone: "XXX" });
}

export function formatDateHHmm(dateString) {
  if (!dateString) return;
  const date = toZonedTime(dateString, "UTC");
  const formatedDate = format(date, "HH:mm", options);
  return formatedDate;
}

export function formatDateMMddYY(dateString) {
  const date = new Date(dateString);

  return format(date, "MM-dd-yy", options);
}
export function formatDateTodayOrDay(dateString) {
  const date = toZonedTime(dateString, "UTC");
  if (isToday(date)) {
    return "Today";
  } else {
    return format(date, "MMMM d, yyyy", options);
  }
}

// TODO: I want to export many functions in this file
