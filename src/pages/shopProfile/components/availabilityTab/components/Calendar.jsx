import { useEffect, useState } from "react";
import { format, isAfter, isBefore, isEqual } from "date-fns";
import BasicModal from "@/components/basicModal/BasicModal";
import ArrowRightIcon from "@mui/icons-material/ArrowRight";
import ArrowLeftIcon from "@mui/icons-material/ArrowLeft";
import servicesService from "@/services/service";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

const schedulesOptions = [
  "05:00",
  "05:30",
  "06:00",
  "06:30",
  "07:00",
  "07:30",
  "08:00",
  "08:30",
  "09:00",
  "09:30",
  "10:00",
  "10:30",
  "11:00",
  "11:30",
  "12:00",
  "12:30",
  "13:00",
  "13:30",
  "14:00",
  "14:30",
  "15:00",
  "15:30",
  "16:00",
  "16:30",
  "17:00",
  "17:30",
  "18:00",
  "18:30",
  "19:00",
  "19:30",
  "20:00",
  "20:30",
  "21:00",
  "21:30",
  "22:00",
];
const daysOfWeek = ["S", "M", "T", "W", "T", "F", "S"];

export default function Calendar({ weekDays, currentService }) {
  const navigate = useNavigate();
  const currentUser = useSelector((state) => state.user);
  const currentDate = new Date();
  const [currentMonth, setCurrentMonth] = useState(currentDate.getMonth());
  const [currentYear, setCurrentYear] = useState(currentDate.getFullYear());
  const [availability, setAvailability] = useState([]);
  const [dayModal, setDayModal] = useState(null);
  const [confirmModal, setConfirmModal] = useState(false);
  const [calendarDays, setCalendarDays] = useState([]);

  const weekIndex = (index) => {
    if (index >= 0 && index <= 6) {
      return index;
    } else if (index >= 7 && index <= 13) {
      return index - 7;
    } else if (index >= 14 && index <= 20) {
      return index - 14;
    } else if (index >= 21 && index <= 27) {
      return index - 21;
    } else if (index >= 28 && index <= 34) {
      return index - 28;
    } else if (index >= 35 && index <= 42) {
      return index - 35;
    }
  };

  const calculateEndTime = (startTime, duration) => {
    // Convierte la hora inicial a minutos totales
    const [hours, minutes] = startTime.split(":").map(Number);
    const startMinutes = hours * 60 + minutes;

    // Suma la duración en minutos
    let endMinutes = startMinutes + duration;

    // Ajusta al siguiente múltiplo de 3
    if (endMinutes % 30 !== 0) {
      endMinutes = Math.ceil(endMinutes / 30) * 30;
    }

    // Convierte los minutos totales a formato "hh:mm"
    const endHours = Math.floor(endMinutes / 60) % 24; // Mod 24 para horas en formato de reloj
    const endMinutesFormatted = endMinutes % 60;

    // Devuelve la hora en formato "hh:mm"
    return `${String(endHours).padStart(2, "0")}:${String(
      endMinutesFormatted,
    ).padStart(2, "0")}`;
  };

  useEffect(() => {
    let availablesSlots = [];
    calendarDays.forEach((day, index) => {
      const slots = weekDays
        ? weekDays.filter((item) => item.day === weekIndex(index))
        : [];
      slots.forEach((slot) => {
        console.log("Slot", slot);
        const [startHs, startMin] = slot.startAt.split(":").map(Number);
        const [endHs, endMin] = slot.endAt.split(":").map(Number);
        const startAt = new Date(
          currentYear,
          currentMonth,
          day,
          startHs,
          startMin,
        );
        const endAt = new Date(currentYear, currentMonth, day, endHs, endMin);

        if (day) {
          availablesSlots.push({
            startAt,
            endAt,
          });
        }
      });
    });

    const mergedAvailability = [
      ...availability,
      ...availablesSlots.filter(
        (slot) =>
          !availability.some((existingSlot) =>
            isEqual(existingSlot.startAt, slot.startAt),
          ),
      ),
    ];

    setAvailability(mergedAvailability);
  }, [weekDays, calendarDays]);

  useEffect(() => {
    if (!currentService) return;

    const startOfMonth = new Date(currentYear, currentMonth, 1);
    const endOfMonth = new Date(currentYear, currentMonth + 1, 0);

    const availabilityForMonth = currentService?.Availabilities?.find(
      (av) =>
        isBefore(startOfMonth, new Date(av.endDate)) &&
        isAfter(endOfMonth, new Date(av.startDate)),
    );

    if (availabilityForMonth) {
      setAvailability(
        availabilityForMonth.turnosDisponibles.map((t) => ({
          ...t,
          startAt: new Date(t.startAt),
          endAt: new Date(t.endAt),
        })) || [],
      );
    } else {
      setAvailability([]);
    }
  }, [currentService, currentMonth, currentYear]);

  useEffect(() => {
    const days = [];
    // Get the number of days in the current month
    const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();

    // Get the first day of the month (0 is Sunday, 6 is Saturday)
    const firstDayOfMonth = new Date(currentYear, currentMonth, 1).getDay();
    // Create an array to represent the calendar days
    for (let i = 0; i < firstDayOfMonth; i++) {
      days.push(null); // Empty slots for days before the 1st
    }
    for (let day = 1; day <= daysInMonth; day++) {
      days.push(day);
    }

    setCalendarDays(days);
  }, [currentMonth]);

  const nextMonth = () => {
    if (currentMonth === 11) {
      setCurrentYear(currentYear + 1);
    }
    setCurrentMonth(new Date(currentYear, currentMonth + 1, 1).getMonth());
  };

  const prevMonth = () => {
    const thisDate = new Date(currentYear, currentMonth, 1);
    if (isBefore(thisDate, currentDate)) {
      return;
    }
    setCurrentMonth(new Date(currentYear, currentMonth - 1, 1).getMonth());
  };

  const handleSendAvailability = () => {
    const filteredAvailability = availability
      .filter((slot) => slot.startAt.getMonth() === currentMonth)
      .map((slot) => ({
        startAt: slot.startAt.toISOString(),
        endAt: slot.endAt.toISOString(),
      }));

    const startDate = new Date(currentYear, currentMonth, 1);
    const endDate = new Date(currentYear, currentMonth + 1, 0);

    servicesService
      .changeAvailability(
        currentService.id,
        {
          startDate: startDate.toISOString(),
          endDate: endDate.toISOString(),
          turnos: filteredAvailability,
          name: format(new Date(currentYear, currentMonth, 1), "MM/yyyy"),
          mold: weekDays,
        },
        currentUser.token,
      )
      .then((data) => {
        if (data.ok) {
          setConfirmModal(true);
        }
      });
  };

  const toggleSelection = (day, option) => {
    // Alternar selección/deselección
    const dateSelected = new Date(
      currentYear,
      currentMonth,
      day,
      option.split(":")[0],
      option.split(":")[1],
    );
    const [endHs, endMin] = calculateEndTime(
      option,
      currentService.duration,
    ).split(":");

    const dateEndAt = new Date(currentYear, currentMonth, day, endHs, endMin);

    const newAvailability = {
      day: day,
      startAt: dateSelected,
      endAt: dateEndAt,
    };

    if (availability.some((slot) => isEqual(slot.startAt, dateSelected))) {
      setAvailability(
        availability.filter((item) => !isEqual(item.startAt, dateSelected)),
      );
    } else {
      setAvailability([...availability, newAvailability]);
    }
  };

  const isDisabled = (day, option) => {
    const dateSelected = new Date(
      currentYear,
      currentMonth,
      day,
      option.split(":")[0],
      option.split(":")[1],
    );
    const slotsForThisDay = availability.filter(
      (item) =>
        item.startAt.getDate() === dateSelected.getDate() &&
        item.startAt.getMonth() === dateSelected.getMonth() &&
        item.startAt.getFullYear() === dateSelected.getFullYear(),
    );

    return slotsForThisDay.some(
      (slot) =>
        isAfter(dateSelected, slot.startAt) &&
        isBefore(dateSelected, slot.endAt),
    );
  };

  const isUnselectable = (day, option) => {
    const dateSelected = new Date(
      currentYear,
      currentMonth,
      day,
      option.split(":")[0],
      option.split(":")[1],
    );

    const [endHs, endMin] = calculateEndTime(
      option,
      currentService.duration,
    ).split(":");
    const dateEndAt = new Date(currentYear, currentMonth, day, endHs, endMin);

    const slotsForThisDay = availability.filter(
      (item) =>
        item.startAt.getDate() === dateSelected.getDate() &&
        item.startAt.getMonth() === dateSelected.getMonth() &&
        item.startAt.getFullYear() === dateSelected.getFullYear(),
    );

    return slotsForThisDay.some(
      (slot) =>
        isAfter(dateEndAt, slot.startAt) && isBefore(dateEndAt, slot.endAt),
    );
  };

  return (
    <div className="w-full max-w-[992px] p-4 rounded bg-main-50 dark:bg-main-950 shadow text-main-0 dark:text-main-100">
      <div className="flex items-center justify-between">
        <ArrowLeftIcon
          fontSize="large"
          className="cursor-pointer duration-200 ease-in hover:text-main-600 dark:hover:text-main-400"
          onClick={prevMonth}
        />
        <h2 className="text-lg">
          {format(new Date(currentYear, currentMonth), "MMMM - yyyy")}
        </h2>
        <ArrowRightIcon
          fontSize="large"
          className="cursor-pointer duration-200 ease-in hover:text-main-600 dark:hover:text-main-400"
          onClick={nextMonth}
        />
        <button className="button" onClick={handleSendAvailability}>
          Save availability for this month
        </button>
      </div>

      <div className="grid grid-cols-7">
        {daysOfWeek.map((day, index) => (
          <div key={index} className="p-4 text-center font-bold">
            {day}
          </div>
        ))}
        {calendarDays.map((day, index) => {
          const currentDate = new Date(currentYear, currentMonth, day);
          const dayCount = availability.filter(
            (item) =>
              item.startAt.getDate() === currentDate.getDate() &&
              item.startAt.getMonth() === currentDate.getMonth() &&
              item.startAt.getFullYear() === currentDate.getFullYear(),
          ).length;

          return (
            <div
              key={index}
              className={`${
                day &&
                "flex relative bg-main-100 dark:bg-main-900 aspect-square p-4 justify-center lg:justify-end items-start font-bold text-main-600 dark:text-main-400 duration-200 ease-linear border boder-main-0 dark:border-main-1000 cursor-pointer hover:bg-main-50 dark:hover:bg-main-950 hover:border-main-600 hover:dark:border-main-400 hover:text-main-0 hover:dark:text-main-100 hover:border-3"
              }`}
              onClick={() => setDayModal(day)}
            >
              {day || ""}
              {dayCount > 0 && day && (
                <span className="absolute text-[10px] aspect-square lg:text-[14px] top-1 lg:top-1/2 right-1 lg:left-1/2 lg:-translate-x-1/2 lg:-translate-y-1/2 w-6 lg:w-1/3 bg-green-700 dark:bg-green-500 p-1 lg:p-2 rounded-full text-main-0 dark:text-main-100">
                  {dayCount}
                </span>
              )}
            </div>
          );
        })}
      </div>
      <BasicModal open={dayModal !== null} setOpen={() => setDayModal(null)}>
        <div className="bg-main-100 dark:bg-main-900 p-4 rounded flex flex-col gap-4">
          <h2 className="text-2xl font-bold pb-4 text-main-0 dark:text-main-1000">
            {format(
              new Date(currentYear, currentMonth, dayModal),
              "eeee, dd-MM-yyyy",
            )}
          </h2>
          <ul className="grid grid-cols-7 gap-2">
            {schedulesOptions.map((option) => {
              const thisDate = new Date(currentYear, currentMonth, dayModal);
              const slotsForTheDay = availability.filter((slot) =>
                isEqual(slot.startAt.getDate(), thisDate.getDate()),
              );

              const isSelected = slotsForTheDay.some((slot) =>
                isEqual(
                  new Date(
                    currentYear,
                    currentMonth,
                    dayModal,
                    option.split(":")[0],
                    option.split(":")[1],
                  ),
                  slot.startAt,
                ),
              );
              return (
                <li
                  key={option}
                  className="flex items-center justify-between"
                  onClick={() => {
                    if (
                      !isDisabled(dayModal, option) &&
                      !isUnselectable(dayModal, option)
                    )
                      toggleSelection(dayModal, option);
                  }}
                >
                  <span
                    className={` p-2 rounded text-main-0 dark:text-main-1000 
                      duration-200 ease-linear cursor-pointer${
                        isSelected
                          ? " bg-green-700 dark:bg-green-500"
                          : isDisabled(dayModal, option)
                            ? ` bg-zinc-400 dark:bg-zinc-400 ${
                                isUnselectable(dayModal, option) &&
                                "cursor-text"
                              }`
                            : " bg-main-50 dark:bg-main-950 hover:bg-main-600 hover:dark:bg-main-400 "
                      }
                  `}
                  >
                    {option}
                  </span>
                </li>
              );
            })}
          </ul>
          <div className="flex w-full justify-end">
            <button className="button" onClick={() => setDayModal(null)}>
              Close
            </button>
          </div>
        </div>
      </BasicModal>
      <BasicModal
        open={confirmModal}
        setOpen={() => {
          setConfirmModal(false);
          navigate(-1);
        }}
      >
        <div className="bg-main-100 dark:bg-main-900 p-4 rounded flex flex-col gap-4">
          <h2 className="text-2xl font-bold pb-4 text-main-0 dark:text-main-1000">
            Service availability correctly saved
          </h2>
          <button
            className="button"
            onClick={() => {
              setConfirmModal(false);
              navigate(-1);
            }}
          >
            Close
          </button>
        </div>
      </BasicModal>
    </div>
  );
}
