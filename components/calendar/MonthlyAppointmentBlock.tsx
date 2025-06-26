import { hexToRGBA } from "@/lib/color";
import { Appointment } from "@/types/models";
import AppointmentHoverCard from "../AppointmentHoverCard";

type Props = {
  appointment: Appointment;
  onClick: () => void;
};

function MonthlyAppointmentBlock({ appointment, onClick }: Props) {
  const bgColor = hexToRGBA(appointment.category.color, 0.3);
  const borderColor = appointment.category.color;

  return (
    <>
      <AppointmentHoverCard appointment={appointment}>
        <div
          onDoubleClick={onClick}
          className="text-[10px] px-2 py-0.5 rounded-sm truncate"
          style={{
            backgroundColor: bgColor,
            borderLeft: `4px solid ${borderColor}`,
          }}>
          {appointment.title}
        </div>
      </AppointmentHoverCard>
    </>
  );
}

export default MonthlyAppointmentBlock;
