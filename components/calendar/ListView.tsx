import { Appointment } from "@/types/models";
import { format, parseISO } from "date-fns";
import { de } from "date-fns/locale";
import { Card } from "@/components/ui/card";
import {
  CalendarClock,
  MapPin,
  MessageSquareTextIcon,
  User,
} from "lucide-react";
import { Badge } from "../ui/badge";
import { hexToRGBA } from "@/lib/color";
import { useState } from "react";

interface Props {
  appointments: Appointment[];
  onSelectAppointment: (appt: Appointment) => void;
}

export default function ListView({ appointments, onSelectAppointment }: Props) {
  const [showPast, setShowPast] = useState(false);
  const today = new Date();

  const isSameDay = (a: Date, b: Date) => a.toDateString() === b.toDateString();

  if (appointments.length === 0) {
    return (
      <p className="text-sm text-gray-500 text-center mt-8">
        Keine Termine gefunden.
      </p>
    );
  }

  // Sort appointments by start time
  const sorted = [...appointments].sort(
    (a, b) => new Date(a.start).getTime() - new Date(b.start).getTime()
  );

  // Group into past and future
  const pastGrouped: { [key: string]: Appointment[] } = {};
  const futureGrouped: { [key: string]: Appointment[] } = {};

  sorted.forEach((appt) => {
    const dateObj = new Date(appt.start);
    const dateKey = format(dateObj, "yyyy-MM-dd");

    if (dateObj < new Date(today.setHours(0, 0, 0, 0))) {
      if (!pastGrouped[dateKey]) pastGrouped[dateKey] = [];
      pastGrouped[dateKey].push(appt);
    } else {
      if (!futureGrouped[dateKey]) futureGrouped[dateKey] = [];
      futureGrouped[dateKey].push(appt);
    }
  });

  // Combine groups for rendering
  const displayGroups = showPast
    ? { ...pastGrouped, ...futureGrouped }
    : futureGrouped;

  const hasPastAppointments = Object.keys(pastGrouped).length > 0;

  return (
    <div className="space-y-6 max-w-2xl m-auto">
      {hasPastAppointments && !showPast && (
        <div className="text-center mt-6">
          <button
            onClick={() => setShowPast(true)}
            className="text-blue-600 hover:underline text-sm">
            Termine vor dem{" "}
            {format(today, "dd.MM.yyyy", {
              locale: de,
            })}{" "}
            laden
          </button>
        </div>
      )}
      {Object.entries(displayGroups).map(([dateKey, dayAppointments]) => {
        const dateObj = parseISO(dateKey);
        const isToday = isSameDay(dateObj, new Date());

        return (
          <div key={dateKey} className={`space-y-3 rounded-xl p-2 `}>
            <h4
              className={`text-lg font-semibold text-gray-700 pb-1 ${
                isToday
                  ? "text-green-600 bg-green-50 rounded-lg border border-green-200 p-2 w-fit"
                  : ""
              }`}>
              {format(dateObj, "EEEE, d. MMMM", { locale: de })}
            </h4>

            <div className="space-y-2">
              {dayAppointments.map((appt) => (
                <Card
                  key={appt.id}
                  className="p-4 cursor-pointer flex flex-col gap-1"
                  onClick={() => onSelectAppointment(appt)}>
                  <div className="flex justify-between items-center">
                    <h3 className="text-md font-semibold text-gray-800">
                      {appt.title}
                    </h3>
                    <div className="space-x-2">
                      <Badge
                        className="text-xs text-gray-600"
                        style={{
                          backgroundColor:
                            hexToRGBA(appt.category?.color, 0.2) || undefined,
                          borderColor: appt.category?.color || undefined,
                        }}>
                        {appt.category?.label || "-"}
                      </Badge>
                      <Badge className="text-gray-600 bg-orange-100 border border-orange-500">
                        Pflegegrad {appt.patient?.care_level}
                      </Badge>
                    </div>
                  </div>

                  <div className="space-y-1">
                    <div className="flex items-center gap-2 text-sm text-gray-700">
                      <CalendarClock size={16} className="text-gray-600" />
                      <span>
                        {format(new Date(appt.start), "p", { locale: de })} –{" "}
                        {format(new Date(appt.end), "p", { locale: de })}
                      </span>
                    </div>

                    <div className="flex items-center gap-2 text-sm text-gray-700">
                      <MapPin size={16} className="text-gray-600" />
                      <span>{appt.location}</span>
                    </div>

                    {appt.notes && (
                      <div className="flex items-center gap-2 text-sm text-gray-700">
                        <MessageSquareTextIcon
                          size={16}
                          className="text-gray-600"
                        />
                        <span>{appt.notes}</span>
                      </div>
                    )}

                    <div className="flex items-center gap-2 text-sm text-gray-700">
                      <User size={16} className="text-gray-600" />
                      <span>
                        {appt.patient?.pronoun} {appt.patient?.firstname}{" "}
                        {appt.patient?.lastname}
                      </span>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        );
      })}

      {appointments.length > 0 && (
        <p className="text-sm text-gray-500 text-center mt-8">
          Keine weiteren Termine gefunden.
        </p>
      )}
    </div>
  );
}
