import { Appointment } from "@/types/models";
import { format } from "date-fns";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import { Clock, MapPin, MessageSquareTextIcon } from "lucide-react";

type Props = {
  appointment: Appointment;
  children: React.ReactNode;
};

export default function AppointmentHoverCard({ appointment, children }: Props) {
  const start = new Date(appointment.start);
  const end = new Date(appointment.end);

  return (
    <HoverCard>
      <HoverCardTrigger asChild>{children}</HoverCardTrigger>
      <HoverCardContent
        className={`text-sm space-y-2 max-w-[260px] border-l-8`}
        style={{ borderLeftColor: appointment.category.color }}>
        <p className="font-semibold">{appointment.title}</p>
        <div className="flex items-start gap-2 text-xs text-gray-700">
          <Clock size={14} className="mt-0.5" />
          <span>
            {format(start, "HH:mm")} bis {format(end, "HH:mm")} Uhr
          </span>
        </div>
        {appointment.location && (
          <div className="flex items-start gap-2 text-xs text-gray-700">
            <MapPin size={14} className="mt-0.5" />
            <span>{appointment.location}</span>
          </div>
        )}
        {appointment.notes && (
          <div className="flex items-start gap-2 text-xs text-gray-700">
            <MessageSquareTextIcon size={14} className="mt-0.5" />
            <span>{appointment.notes}</span>
          </div>
        )}
      </HoverCardContent>
    </HoverCard>
  );
}
