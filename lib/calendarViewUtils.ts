import { Appointment } from "@/types/models";
import { isSameDay } from "date-fns";
import { toZonedTime } from "date-fns-tz";

export type PositionedAppointment = {
  appt: Appointment;
  start: Date;
  end: Date;
  top: number;
  height: number;
};

// week view related functions
export function getPositionedAppointmentForWeekView(
  appointments: Appointment[],
  day: Date
): PositionedAppointment[] {
  return appointments
    .filter((appt) => {
      const start = new Date(appt.start);
      const end = new Date(appt.end);
      return end > start && isSameDay(start, day);
    })
    .map((appt) => {
      const start = new Date(appt.start);
      const end = new Date(appt.end);

      const startMinutes = start.getHours() * 60 + start.getMinutes();
      const endMinutes = end.getHours() * 60 + end.getMinutes();
      const duration = endMinutes - startMinutes;

      const top = (startMinutes / 1440) * 100;
      const height = (duration / 1440) * 100;

      return {
        appt,
        start,
        end,
        top,
        height,
      };
    });
}

// month view related functions
export function getAppointmentsForDay(
  appointments: Appointment[],
  day: Date
): Appointment[] {
  const timeZone = "Europe/Berlin";

  return appointments.filter((appt) => {
    const start = toZonedTime(new Date(appt.start), timeZone);
    const end = toZonedTime(new Date(appt.end), timeZone);
    return end > start && isSameDay(start, day);
  });
}
