export default function WeekCalendar({ selected, setSelected, duration }) {
  const days = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];

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

  // Función para convertir horas (HH:mm) en minutos desde la medianoche
  const timeToMinutes = (time) => {
    const [hours, minutes] = time.split(":").map(Number);
    return hours * 60 + minutes;
  };

  // Verificar si una opción está dentro de un rango de tiempo
  const isInRange = (option, range) => {
    const optionTime = timeToMinutes(option);
    const startTime = timeToMinutes(range.startAt);
    const endTime = timeToMinutes(range.endAt);

    return optionTime >= startTime && optionTime < endTime;
  };

  const canBeSelected = (dayIndex, option) => {
    const startTime = timeToMinutes(option);
    const endTime = startTime + Math.ceil(duration / 30) * 30;

    // Si el rango supera el último horario disponible, no se puede seleccionar
    if (
      endTime > timeToMinutes(schedulesOptions[schedulesOptions.length - 1])
    ) {
      return false;
    }

    // Comprobar si el rango completo entra en conflicto con algún rango existente
    return !selected.some((range) => {
      if (range.day !== dayIndex) return false; // Día diferente, no hay conflicto

      const rangeStart = timeToMinutes(range.startAt);
      const rangeEnd = timeToMinutes(range.endAt);

      // Verificar solapamiento entre el rango seleccionado y los existentes
      return (
        (startTime >= rangeStart && startTime < rangeEnd) || // Comienza dentro de un rango
        (endTime > rangeStart && endTime <= rangeEnd) || // Termina dentro de un rango
        (startTime <= rangeStart && endTime >= rangeEnd) // Abarca completamente un rango
      );
    });
  };

  const handleSelection = (dayIndex, option) => {
    const existingRangeIndex = selected
      ? selected.findIndex(
          (range) => range.day === dayIndex && range.startAt === option,
        )
      : -1;

    if (existingRangeIndex !== -1) {
      // Si la opción es el startAt actual, deseleccionarla
      const updatedSelected = [...selected];
      updatedSelected.splice(existingRangeIndex, 1);
      setSelected(updatedSelected);
      return;
    }
    if (selected && !canBeSelected(dayIndex, option)) return;

    // Verificar si la opción está en rango
    const isOptionInRange = selected
      ? selected.some(
          (range) => range.day === dayIndex && isInRange(option, range),
        )
      : false;

    if (isOptionInRange) return; // No permitir selección si está en rango

    const startTime = timeToMinutes(option);
    const endTime = startTime + Math.ceil(duration / 30) * 30;
    const endAt = schedulesOptions.find(
      (opt) => timeToMinutes(opt) === endTime,
    );

    if (!endAt) return;

    const newRange = { day: dayIndex, startAt: option, endAt };

    setSelected(selected ? [...selected, newRange] : [newRange]);
  };

  return (
    <div className="w-full max-w-[992px] p-4 rounded bg-main-50 dark:bg-main-950 shadow">
      <ul className="flex w-full justify-between">
        {days.map((day, dayIndex) => {
          return (
            <li
              key={dayIndex}
              className="flex-1 border border-main-600 dark:border-main-400"
            >
              <h4 className="p-2 text-ellipsis whitespace-nowrap min-w-0 text-sm font-bold">
                {day}
              </h4>
              <ul>
                {schedulesOptions.map((option, index) => {
                  // Verificar clases dinámicas
                  const isSelected = selected?.some(
                    (range) =>
                      range.day === dayIndex && range.startAt === option,
                  );
                  const isInRangeClass = selected?.some(
                    (range) =>
                      range.day === dayIndex && isInRange(option, range),
                  );

                  return (
                    <li
                      key={index}
                      className={`border-t border-main-500 dark:border-main-300 cursor-pointer hover:bg-main-400 ${
                        isSelected
                          ? "bg-green-700 "
                          : isInRangeClass
                            ? "cursor-text bg-zinc-400 border-zinc-500 text-zinc-600"
                            : ""
                      }`}
                      onClick={() => handleSelection(dayIndex, option)}
                    >
                      {option}
                    </li>
                  );
                })}
              </ul>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
