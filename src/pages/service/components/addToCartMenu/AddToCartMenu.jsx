import { useEffect, useLayoutEffect, useState } from "react";
import DatePicker from "@/components/DatePicker";
import Calendar from "@/components/calendar/Calendar";
import SelectData from "@/components/selectData/SelectData";
import { BiX } from "react-icons/bi";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import ParticipantsModal from "./components/ParticipantsModal";
import { format, isSameDay } from "date-fns";

export default function AddToCartMenu({ item }) {
  const [participants, setParticipants] = useState(
    item?.minimumParticipants || 1,
  );
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const [open, setOpen] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  const [selectedDate, setSelectedDate] = useState({ date: null, time: null });
  const [schedules, setSchedules] = useState(["11:00", "12:30", "14:00"]);

  useEffect(() => {
    const daySchedules = item.Availabilities.flatMap((availability) =>
      availability.turnosDisponibles
        .filter((turno) =>
          isSameDay(new Date(turno.startAt), selectedDate.date),
        )
        .filter((t) => t.libre > 0)
        .map((t) => format(new Date(t.startAt), "HH:mm")),
    );

    const uniqueSchedules = [...new Set(daySchedules)].sort();

    setSchedules(uniqueSchedules);
  }, [selectedDate]);

  useLayoutEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };

    window.addEventListener("resize", handleResize);
  });
  const subtotal = participants * item.price;

  return (
    <>
      <aside
        className={`fixed md:flex flex-col gap-4 w-[300px] p-6 h-max top-19 z-90 left-4 md:left-auto md:top-4 shadow md:sticky rounded bg-main-50 dark:bg-main-950 ${
          open ? "flex" : "hidden"
        }`}
      >
        <div
          className="md:hidden flex cursor-pointer absolute right-1 top-1 p-2 bg-red-600 text-main-1000 rounded-lg"
          onClick={() => setOpen(false)}
        >
          <BiX color="primary"></BiX>
        </div>
        <h3 className="font-bold text-main-0 dark:text-main-1000">
          Select a date
        </h3>
        {windowWidth < 1025 ? (
          <DatePicker
            selectedDate={selectedDate}
            setSelectedDate={setSelectedDate}
            availableDates={item.Availabilities}
          />
        ) : (
          <Calendar
            selectedDate={selectedDate}
            setSelectedDate={setSelectedDate}
            availableDates={item.Availabilities}
          />
        )}

        {selectedDate.date && (
          <>
            <h3 className="font-bold text-main-0 dark:text-main-1000">
              Pick a time
            </h3>
            <h4 className="-m-4 text-main-0 dark:text-main-1000 font-thin mb-1">
              {item.destinations[0].name} local time
            </h4>
            <ul className="flex flex-col bg-main-100 dark:bg-main-900 py-4 px-2 gap-2 rounded">
              {schedules.map((schedule, index) => {
                const isSelected = schedule === selectedDate.time;
                return (
                  <li
                    key={index}
                    className={` rounded cursor-pointer duration-300 ease-linear
                       text-main-0 dark:text-main-1000 hover:text-main-600 dark:hover:text-main-400 ${
                         isSelected
                           ? "bg-green-700 dark:bg-green-500"
                           : "bg-main-50 dark:bg-main-950"
                       }`}
                    onClick={() => {
                      setSelectedDate({ ...selectedDate, time: schedule });
                    }}
                  >
                    {schedule}
                  </li>
                );
              })}
            </ul>
          </>
        )}

        <div className="flex flex-col gap-2">
          <h3 className="font-bold text-main-0 dark:text-main-1000">
            Participants
          </h3>
          <SelectData
            items={Array.from(
              {
                length: item.maximumParticipants - item.minimumParticipants + 1,
              },
              (_, index) => item.minimumParticipants + index,
            )}
            data={participants}
            setData={setParticipants}
          />
          <p className="text-lg font-semibold text-main-0 dark:text-main-1000">
            Total:
            <span className="text-bold"> ${subtotal.toFixed(2)}</span>
          </p>
        </div>
        <div className="flex flex-col w-full items-center justify-center">
          <button
            className="button"
            onClick={() => setOpenModal(true)}
            disabled={!selectedDate.date || !selectedDate.time}
          >
            Add to cart
          </button>
        </div>
      </aside>
      <div
        className="md:hidden flex fixed p-4 bg-main-600 dark:bg-main-400 z-40 rounded-lg items-center justify-center aspect-square cursor-pointer duration-300 ease-linear h-16 hover:bg-green-700 dark:hover:bg-green-500 text-main-1000"
        onClick={() => setOpen(true)}
      >
        <CalendarMonthIcon />
      </div>
      <ParticipantsModal
        open={openModal}
        setOpen={setOpenModal}
        length={participants}
        service={{ ...item, date: selectedDate }}
      />
    </>
  );
}
