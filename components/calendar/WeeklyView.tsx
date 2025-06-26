import { useEffect, useState } from "react";
import { startOfWeek, format, isSameDay } from "date-fns";
import { toZonedTime } from "date-fns-tz";
import { de } from "date-fns/locale";
import { Appointment } from "@/types/models";
import { getPositionedAppointmentForWeekView } from "@/lib/calendarViewUtils";
import WeeklyAppointmentBlock from "./WeeklyAppointmentBlock";

type Props = {
  appointments: Appointment[];
  selectedDate: Date;
  onSelectAppointment: (appointment: Appointment) => void;
};

function WeeklyView({
  selectedDate,
  appointments,
  onSelectAppointment,
}: Props) {
  const [currentWeek, setCurrentWeek] = useState<Date[]>([]);

  const timeZone = "Europe/Berlin";
  const now = toZonedTime(new Date(), timeZone);
  const currentMinutes = now.getHours() * 60 + now.getMinutes();

  useEffect(() => {
    // to update the current week when the selected date changes
    const startOfWeekDate: Date = startOfWeek(selectedDate, {
      weekStartsOn: 1,
    });

    const weekDays = [];

    for (let i = 0; i < 7; i++) {
      const day = new Date(startOfWeekDate);
      day.setDate(startOfWeekDate.getDate() + i);
      weekDays.push(day);
    }

    setCurrentWeek(weekDays);
  }, [selectedDate]);

  return (
    <>
      {/* first row to display the week dates and days */}
      <div className="grid grid-cols-[50px_repeat(7,1fr)]">
        <div>
          {/* this empty div is just to get the week started from the 2nd column in the grid */}
        </div>

        {currentWeek.map((day, dayIndex) => (
          <div
            key={dayIndex}
            className={` h-fit p-2 mb-1 ${
              isSameDay(day, now)
                ? "bg-green-50 rounded-lg border border-green-200"
                : ""
            }`}>
            <p
              className={`text-gray-600 text-sm ${
                isSameDay(day, now) ? "text-green-600 font-semibold" : ""
              }`}>
              {format(day, "EEE, d. MMMM", { locale: de })}
            </p>
          </div>
        ))}
      </div>

      {/* time column */}
      <div className="grid grid-cols-[50px_repeat(7,1fr)]">
        <div className="flex flex-col">
          {[...Array(24)].map((_, hour) => (
            <div
              key={hour}
              className="h-[60px] text-gray-600 text-xs text-right pr-2">
              {`${hour.toString().padStart(2, "0")}:00`}
            </div>
          ))}
        </div>
        <div className="col-span-7 relative h-[1440px] grid grid-cols-7 border">
          {currentWeek.map((day, dayIndex) => (
            <div key={dayIndex} className="border-l relative">
              {[...Array(24)].map((_, hour) => (
                <div
                  key={hour}
                  className={`h-[60px] border-b ${
                    isSameDay(day, now) ? "bg-green-50" : ""
                  }`}></div>
              ))}

              {/* shows the appointment */}
              {getPositionedAppointmentForWeekView(appointments, day).map(
                (item, i) => (
                  <WeeklyAppointmentBlock
                    onClick={() => onSelectAppointment(item.appt)}
                    key={i}
                    item={item}
                  />
                )
              )}

              {/* this will show a line for the current time */}
              <div
                className="absolute left-0 right-0 h-0.5 bg-red-500 z-10"
                style={{ top: `${(currentMinutes / 1440) * 100}%` }}
              />
            </div>
          ))}
        </div>
      </div>
    </>
  );
}

export default WeeklyView;
