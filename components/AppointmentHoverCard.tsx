import { Appointment } from "@/types/models";
import { format } from "date-fns";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import {
  Clock,
  Copy,
  Mail,
  MapPin,
  MessageSquareTextIcon,
  User,
} from "lucide-react";
import { Button } from "./ui/button";
import { toast } from "sonner";

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

        {/* patient */}
        <div className="flex items-start gap-2 text-xs text-gray-700">
          <User size={14} className="mt-0.5" />
          <span>
            {appointment.patient.pronoun} {appointment.patient.firstname}{" "}
            {appointment.patient.lastname}
          </span>
        </div>

        {/* email */}
        <div className="flex items-start justify-between gap-2 text-xs text-gray-700">
          <div className="flex items-start gap-2">
            <Mail size={14} className="mt-0.5" />
            <span>{appointment.patient.email}</span>
          </div>

          <Button
            variant="ghost"
            size="icon"
            className="h-4 w-4"
            onClick={() => {
              navigator.clipboard.writeText(appointment.patient.email);
              toast.success("E-Mail kopiert!");
            }}>
            <Copy size={14} />
          </Button>
        </div>

        {/* time */}
        <div className="flex items-start gap-2 text-xs text-gray-700">
          <Clock size={14} className="mt-0.5" />
          <span>
            {format(start, "HH:mm")} bis {format(end, "HH:mm")} Uhr
          </span>
        </div>

        {/* location */}
        {appointment.location && (
          <div className="flex items-start gap-2 text-xs text-gray-700">
            <MapPin size={14} className="mt-0.5" />
            <span>{appointment.location}</span>
          </div>
        )}

        {/* note */}
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
