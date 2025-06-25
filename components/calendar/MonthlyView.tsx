import { Appointment } from "@/types/models";
import {
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  addDays,
  isSameMonth,
  format,
  isSameDay,
} from "date-fns";
import { toZonedTime } from "date-fns-tz";
import { useEffect, useState } from "react";

// TODO: functionalities need to add
// [] when clicked on a cell, it should show all the appointments for the current date
// [] highlight the current day
// [X] show appointments in pill shaped
// [] maybe add prev & next month buttons

type Props = {
  appointments: Appointment[];
  selectedDate: Date;
};

function MonthlyView({ selectedDate, appointments }: Props) {
  const [selectedMonth, setSelectedMonth] = useState<Date>(selectedDate);
  const [days, setDays] = useState<Date[]>([]);

  const daysOfWeek = ["Mon", "Die", "Mit", "Don", "Fre", "Sam", "Son"];
  const timeZone = "Europe/Berlin";

  useEffect(() => {
    const days = generateCalendarDays(new Date());
    setDays(days);
  }, []);

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

  function hexToRGBA(hex: string, opacity: number) {
    let c: any;
    if (/^#([A-Fa-f0-9]{3}){1,2}$/.test(hex)) {
      c = hex.substring(1).split("");
      if (c.length === 3) {
        c = [c[0], c[0], c[1], c[1], c[2], c[2]];
      }
      c = "0x" + c.join("");
      return (
        "rgba(" +
        [(c >> 16) & 255, (c >> 8) & 255, c & 255].join(",") +
        `,${opacity})`
      );
    }
    throw new Error("Bad Hex");
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
        {days.map((date, index) => (
          <div
            key={index}
            className={`aspect-square p-2 text-sm border border-gray-200 font-semibold font-gray-700 ${
              !isSameMonth(date, selectedMonth) ? "text-gray-400" : ""
            }`}>
            {format(date, "d")}

            {/* Appointments for this day */}
            <div className="flex flex-col gap-1">
              {appointments
                .filter((appt) => {
                  const start = toZonedTime(new Date(appt.start), timeZone);
                  const end = toZonedTime(new Date(appt.end), timeZone);
                  return end > start && isSameDay(start, date);
                })
                .map((appt, idx) => (
                  <div
                    key={idx}
                    className="text-[10px] px-2 py-0.5 rounded-sm truncate"
                    style={{
                      backgroundColor: hexToRGBA(appt.category.color, 0.3),
                      borderLeft: `4px solid ${appt.category.color}`,
                    }}
                    title={appt.title}>
                    {appt.title}
                  </div>
                ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default MonthlyView;
