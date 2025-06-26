import { hexToRGBA } from "@/lib/color";
import { PositionedAppointment } from "@/lib/calendarViewUtils";
import { format } from "date-fns";
import AppointmentHoverCard from "../AppointmentHoverCard";

type Props = {
  item: PositionedAppointment;
  onClick: () => void;
};

export default function WeeklyAppointmentBlock({ item, onClick }: Props) {
  const { appt, start, end, top, height } = item;

  return (
    <>
      <AppointmentHoverCard appointment={appt}>
        <div
          onClick={onClick}
          className="absolute left-1 right-1 text-xs p-1 rounded shadow-md overflow-hidden"
          style={{
            top: `${top}%`,
            height: `${height}%`,
            borderLeft: `4px solid ${appt.category.color}`,
            backgroundColor: hexToRGBA(appt.category.color, 0.3),
          }}>
          <strong>{appt.title}</strong>
          <br />
          <span className="text-[10px]">
            {format(start, "HH:mm")} - {format(end, "HH:mm")}
          </span>
        </div>
      </AppointmentHoverCard>
    </>
  );
}
