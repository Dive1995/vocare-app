"use client";

import MonthlyView from "@/components/calendar/MonthlyView";
import WeeklyView from "@/components/calendar/WeeklyView";
import DatePicker from "@/components/DatePicker";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Appointment, AppointmentForm } from "@/types/models";
import { PlusIcon, Settings2Icon } from "lucide-react";
import { useEffect, useState } from "react";
import { toZonedTime } from "date-fns-tz";
import AppointmentFormDialog from "@/components/AppointmentFormDialog";

export default function Home() {
  const timeZone = "Europe/Berlin"; // to make sure we have consistent timestamp regardless of user's local time

  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [selectedDate, setSelectedDate] = useState(
    toZonedTime(new Date(), timeZone)
  );
  const [openTerminDialog, setOpenTerminDialog] = useState(false);
  const [selectedAppointment, setSelectedAppointment] =
    useState<Appointment | null>(null);

  useEffect(() => {
    fetchAppointments();
  }, [selectedDate]);

  // fetches appointment data, depending on the date selected
  const fetchAppointments = async () => {
    try {
      const res = await fetch("/api/appointments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ monthDate: selectedDate }),
      });

      if (!res.ok) throw new Error("Failed to fetch appointments");

      const data: Appointment[] = await res.json();
      console.log("Appointments: ", data);
      setAppointments(data);

      // dummy data to test
      // setAppointments([
      //   {
      //     id: "63ece9cd-9838-4124-8d28-20d0deae697a",
      //     start: new Date("2025-06-23T20:30:00+00:00"),
      //     end: new Date("2025-06-23T21:30:00+00:00"),
      //     location: "Musterstraße 123, 12345 Darmstadt",
      //     patient: {
      //       id: "0667a0a7-6909-4f05-9be1-9bc390462311",
      //       email: "paul.weber@example.com",
      //       pronoun: "Herr",
      //       lastname: "Weber",
      //       firstname: "Paul",
      //       birth_date: new Date("1965-09-19T23:00:00+00:00"),
      //       care_level: 4,
      //     },
      //     attachements: null,
      //     category: {
      //       id: "4d38eb6d-741e-4611-9b2d-d2a0a23b8727",
      //       color: "#0000ff",
      //       label: "Erstgespräch",
      //     },
      //     notes: "Pflegedienstleitung muss mit Vorort sein.",
      //     title: "Erstgespräch Paul Weber",
      //     activities: [],
      //   },
      //   {
      //     id: "7a66a78d-3332-461a-8e46-3c23f8d50be1",
      //     start: new Date("2025-06-25T10:50:00+00:00"),
      //     end: new Date("2025-06-25T11:51:00+00:00"),
      //     location: "Adhsadh Bremen",
      //     patient: {
      //       id: "bde3bd51-f416-41d1-b7f2-e753e8dae296",
      //       email: "lea.schneider@example.com",
      //       pronoun: "Frau",
      //       lastname: "Schneider",
      //       firstname: "Lea",
      //       birth_date: new Date("2000-11-29T23:00:00+00:00"),
      //       care_level: 1,
      //     },
      //     attachements: null,
      //     category: {
      //       id: "4d38eb6d-741e-4611-9b2d-d2a0a23b8727",
      //       color: "#0000ff",
      //       label: "Erstgespräch",
      //     },
      //     notes: "Nien Nien",
      //     title: "sadsad123",
      //     activities: [],
      //   },
      //   {
      //     id: "9a90d0e5-b9a8-498c-b47d-4b15d6e056a1",
      //     start: new Date("2025-06-19T13:31:00+00:00"),
      //     end: new Date("2025-06-19T15:33:00+00:00"),
      //     location: "Breman ",
      //     patient: {
      //       id: "f5013ec7-500b-4eab-a8e7-bce158a58321",
      //       email: "anna.mueller@example.com",
      //       pronoun: "Frau",
      //       lastname: "Müller",
      //       firstname: "Anna",
      //       birth_date: new Date("1990-04-22T22:00:00+00:00"),
      //       care_level: 2,
      //     },
      //     attachements: null,
      //     category: {
      //       id: "3f0611b2-f03c-464a-94c4-48934aa80e92",
      //       color: "#ff0000",
      //       label: "MDK-Besuch",
      //     },
      //     notes: "No msg",
      //     title: "Test",
      //     activities: [],
      //   },
      //   {
      //     id: "20b64eec-4546-4a16-aaea-842e577cccff",
      //     start: new Date("2025-06-25T16:00:00+00:00"),
      //     end: new Date("2025-06-25T17:00:00+00:00"),
      //     location: "Darmstadt",
      //     patient: {
      //       id: "f5013ec7-500b-4eab-a8e7-bce158a58321",
      //       email: "anna.mueller@example.com",
      //       pronoun: "Frau",
      //       lastname: "Müller",
      //       firstname: "Anna",
      //       birth_date: new Date("1990-04-22T22:00:00+00:00"),
      //       care_level: 2,
      //     },
      //     attachements: null,
      //     category: {
      //       id: "a2486be6-5e6b-4b2a-ab19-e2f8350b2897",
      //       color: "#00ff00",
      //       label: "Arztbesuch",
      //     },
      //     notes: "null",
      //     title: "Testbesuch",
      //     activities: [],
      //   },
      // ]);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      console.log("Error trying to fetch appointments: ", err.message);
    }
  };

  const handleDialogSubmit = (data: AppointmentForm) => {
    if (selectedAppointment) {
      console.log("UPDATE");
      handleAppointmentEdit(data);
    } else {
      console.log("NEW");
      handleNewAppointmentSubmit(data);
    }
  };

  // adds new appointment
  const handleNewAppointmentSubmit = async (data: AppointmentForm) => {
    const res = await fetch("/api/newAppointment", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    if (!res.ok) throw new Error("Failed to add new appointment");

    const result = await res.json();

    console.log("new appointment saved: ", result);

    fetchAppointments();
  };

  // updates existing appointment
  const handleAppointmentEdit = async (data: AppointmentForm) => {
    const res = await fetch(
      `/api/updateAppointment/${selectedAppointment?.id}`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      }
    );

    if (!res.ok) throw new Error("Failed to add new appointment");

    const result = await res.json();

    console.log("updated appointment saved: ", result);

    fetchAppointments();
  };

  return (
    <div className="max-w-6xl m-auto p-3 my-4">
      <h1 className="text-3xl text-gray-700">Terminnen</h1>
      <div>
        <Tabs defaultValue="list">
          <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
            <div className="flex gap-2">
              <DatePicker date={selectedDate} setDate={setSelectedDate} />

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
              <Button onClick={() => setOpenTerminDialog(true)}>
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
              <WeeklyView
                selectedDate={selectedDate}
                appointments={appointments}
                onSelectAppointment={(appt: Appointment) => {
                  setSelectedAppointment(appt);
                  setOpenTerminDialog(true);
                }}
              />
            </TabsContent>
            <TabsContent value="month">
              <MonthlyView
                selectedDate={selectedDate}
                appointments={appointments}
                onSelectAppointment={(appt: Appointment) => {
                  setSelectedAppointment(appt);
                  setOpenTerminDialog(true);
                }}
              />
            </TabsContent>
          </div>
        </Tabs>
      </div>

      <AppointmentFormDialog
        open={openTerminDialog}
        onOpenChange={(open) => {
          setOpenTerminDialog(open);
          if (!open) setSelectedAppointment(null); // reset when we close it
        }}
        appointment={selectedAppointment}
        onSubmit={handleDialogSubmit}
      />
    </div>
  );
}
