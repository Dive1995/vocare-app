import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { de } from "date-fns/locale";
import { CalendarIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Dispatch, SetStateAction } from "react";

type Props = {
  date: Date;
  setDate: Dispatch<SetStateAction<Date>>;
};

function DatePicker({ date, setDate }: Props) {
  return (
    <>
      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            className={cn(
              "w-[240px] pl-3 text-left font-normal flex justify-baseline gap-2",
              !date && "text-muted-foreground"
            )}>
            <CalendarIcon className="h-4 w-4 opacity-50" />
            {date ? (
              format(date, "PPP", { locale: de })
            ) : (
              <span>Datum wählen</span>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            mode="single"
            selected={date}
            onSelect={(e) => {
              if (e) setDate(e);
            }}
            disabled={(date) => date < new Date("1900-01-01")}
            captionLayout="dropdown"
          />
        </PopoverContent>
      </Popover>
    </>
  );
}

export default DatePicker;
