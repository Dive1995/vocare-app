"use client";

import MonthlyView from "@/components/calendar/MonthlyView";
import WeeklyView from "@/components/calendar/WeeklyView";
import DatePicker from "@/components/DatePicker";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Appointment } from "@/types/models";
import { PlusIcon, Settings2Icon } from "lucide-react";
import { useEffect, useState } from "react";

export default function Home() {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [error, setError] = useState(null);
  const [date, setDate] = useState(new Date());

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const res = await fetch("/api/appointments", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ monthDate: date }),
        });

        if (!res.ok) throw new Error("Failed to fetch appointments");

        const data: Appointment[] = await res.json();
        console.log("Appointments: ", data);
        setAppointments(data);
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } catch (err: any) {
        setError(err.message);
      }
    };

    fetchAppointments();
  }, [date]);

  return (
    <div className="max-w-6xl m-auto p-3 my-4">
      <h1 className="text-3xl text-gray-700">Terminnen</h1>
      <div>
        <Tabs defaultValue="list">
          <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
            <div className="flex gap-2">
              <DatePicker date={date} setDate={setDate} />

              <TabsList>
                <TabsTrigger value="list">Liste</TabsTrigger>
                <TabsTrigger value="week">Woche</TabsTrigger>
                <TabsTrigger value="month">Monat</TabsTrigger>
              </TabsList>
            </div>

            <div className="flex gap-2">
              <Button variant="outline">
                <Settings2Icon />
                Termine filtern
              </Button>
              <Button>
                <PlusIcon />
                Neuer Termin
              </Button>
            </div>
          </div>

          <div>
            <TabsContent value="list">
              <div>List view</div>
            </TabsContent>
            <TabsContent value="week">
              <WeeklyView />
            </TabsContent>
            <TabsContent value="month">
              <MonthlyView />
            </TabsContent>
          </div>
        </Tabs>
      </div>
    </div>
  );
}
