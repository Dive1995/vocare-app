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

// TODO: functionalities need to add
// [] when clicked on a cell, it should show all the appointments for the current date
// [] highlight the current day
// [] show appointments in pill shaped
// [] maybe add prev & next month buttons

function MonthlyView() {
  const [selectedMonth, setSelectedMonth] = useState<Date>(new Date()); //TODO: this should change according to whichever month is being currently viewed
  const [days, setDays] = useState<Date[]>([]);
  const daysOfWeek = ["Mon", "Die", "Mit", "Don", "Fre", "Sam", "Son"];

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
          </div>
        ))}
      </div>
    </div>
  );
}

export default MonthlyView;
