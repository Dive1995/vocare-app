import { Appointment } from "@/types/models";
import {
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  addDays,
  isSameMonth,
  format,
  isToday,
} from "date-fns";
import { useEffect, useState } from "react";
import MonthlyAppointmentBlock from "./MonthlyAppointmentBlock";
import { getAppointmentsForDay } from "@/lib/calendarViewUtils";

type Props = {
  appointments: Appointment[];
  selectedDate: Date;
  onSelectAppointment: (appointment: Appointment) => void;
  onEmptySpaceClick: () => void;
};

function MonthlyView({
  selectedDate,
  appointments,
  onSelectAppointment,
  onEmptySpaceClick,
}: Props) {
  //   const [selectedMonth, setSelectedMonth] = useState<Date>(selectedDate);
  const [days, setDays] = useState<Date[]>([]);

  const daysOfWeek = ["Mon", "Die", "Mit", "Don", "Fre", "Sam", "Son"];

  useEffect(() => {
    const days = generateCalendarDays(selectedDate);
    setDays(days);
  }, [selectedDate]);

  function generateCalendarDays(currentDate: Date): Date[] {
    const start = startOfWeek(startOfMonth(currentDate), { weekStartsOn: 1 });
    const end = endOfWeek(endOfMonth(currentDate), { weekStartsOn: 1 });

    const days: Date[] = [];
    let day = start;

    while (day <= end) {
      days.push(day);
      day = addDays(day, 1);
    }

    return days;
  }

  return (
    <div className="max-w-5xl m-auto">
      <h2 className="text-2xl mb-4 w-fit m-auto bg-gray-100 py-1 text-gray-800 px-2 rounded-lg shadow">
        {format(selectedDate, "MMMM, yyyy")}
      </h2>
      <div className="grid grid-cols-7">
        {daysOfWeek.map((day, index) => (
          <div className="px-2 py-1" key={index}>
            <p className="text-gray-600">{day}</p>
          </div>
        ))}
      </div>
      <div className="grid grid-cols-7 rounded">
        {days.map((day, index) => (
          <div
            key={index}
            onDoubleClick={onEmptySpaceClick}
            className={`aspect-square p-2 text-sm border border-gray-200 font-semibold font-gray-700 `}>
            <span
              className={`${
                isToday(day)
                  ? "text-green-600 p-1 border border-green-700 bg-green-50 rounded-lg"
                  : !isSameMonth(day, selectedDate)
                  ? "text-gray-400"
                  : "text-gray-700"
              }`}>
              {format(day, "d")}
            </span>

            {/* Appointments for this day */}
            <div className="flex flex-col gap-1">
              {getAppointmentsForDay(appointments, day).map((item, i) => (
                <MonthlyAppointmentBlock
                  onClick={() => onSelectAppointment(item)}
                  key={i}
                  appointment={item}
                />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default MonthlyView;
