import { Appointment } from "@/types/models";
import {
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  addDays,
  isSameMonth,
  format,
} from "date-fns";
import { useEffect, useState } from "react";
import MonthlyAppointmentBlock from "./MonthlyAppointmentBlock";
import { getAppointmentsForDay } from "@/lib/calendarViewUtils";

// TODO: functionalities need to add
// [] when clicked on a cell, it should show all the appointments for the current date
// [] highlight the current day
// [X] show appointments in pill shaped
// [] maybe add prev & next month buttons

type Props = {
  appointments: Appointment[];
  selectedDate: Date;
  onSelectAppointment: (appointment: Appointment) => void;
};

function MonthlyView({
  selectedDate,
  appointments,
  onSelectAppointment,
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
            className={`aspect-square p-2 text-sm border border-gray-200 font-semibold font-gray-700 ${
              !isSameMonth(day, selectedDate) ? "text-gray-400" : ""
            }`}>
            {format(day, "d")}

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
