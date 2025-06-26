"use client";

import MonthlyView from "@/components/calendar/MonthlyView";
import WeeklyView from "@/components/calendar/WeeklyView";
import DatePicker from "@/components/DatePicker";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Appointment,
  AppointmentForm,
  Category,
  PatientSearchResult,
} from "@/types/models";
import { PlusIcon, Settings2Icon } from "lucide-react";
import { useEffect, useState } from "react";
import { toZonedTime } from "date-fns-tz";
import AppointmentFormDialog from "@/components/AppointmentFormDialog";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import FilterPopover from "@/components/FilterPopover";
import ListView from "@/components/calendar/ListView";

export default function Home() {
  const timeZone = "Europe/Berlin";

  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [patients, setPatients] = useState<PatientSearchResult[]>([]);

  const [selectedDate, setSelectedDate] = useState(
    toZonedTime(new Date(), timeZone)
  );

  const [openTerminDialog, setOpenTerminDialog] = useState(false);
  const [selectedAppointment, setSelectedAppointment] =
    useState<Appointment | null>(null);

  const [filterCategory, setFilterCategory] = useState<string | null>(null);
  const [filterPatient, setFilterPatient] = useState<string | null>(null);
  const [filteredAppointments, setFilteredAppointments] = useState<
    Appointment[]
  >([]);

  useEffect(() => {
    fetchAppointments();
  }, [selectedDate]);

  // fetch categories only on the first page load
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await fetch("/api/categories", {
          method: "GET",
          headers: { "Content-Type": "application/json" },
        });

        if (!res.ok) throw new Error("Failed to fetch categories");

        const data: Category[] = await res.json();
        setCategories(data);
      } catch (err: any) {
        console.log("Error trying to fetch categories: ", err.message);
      }
    };

    fetchCategories();
  }, []);

  // search patients
  const fetchPatientBySearch = async (search: string) => {
    try {
      const res = await fetch("/api/patients", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ search: search }),
      });

      if (!res.ok) throw new Error("Failed to fetch patients");

      const data: PatientSearchResult[] = await res.json();
      setPatients(data);
    } catch (err: any) {
      console.log("Error trying to fetch patients: ", err.message);
    }
  };

  // filter appointments
  useEffect(() => {
    const filtered = appointments.filter((appt) => {
      const matchesCategory =
        !filterCategory || appt.category.id === filterCategory;
      const matchesPatient =
        !filterPatient || appt.patient.id === filterPatient;
      return matchesCategory && matchesPatient;
    });

    setFilteredAppointments(filtered);
  }, [appointments, filterCategory, filterPatient]);

  const fetchAppointments = async () => {
    try {
      const res = await fetch("/api/appointments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ monthDate: selectedDate }),
      });

      if (!res.ok) throw new Error("Failed to fetch appointments");

      const data: Appointment[] = await res.json();
      setAppointments(data);
    } catch (err: any) {
      console.log("Error trying to fetch appointments: ", err.message);
    }
  };

  const handleDialogSubmit = (data: AppointmentForm) => {
    if (selectedAppointment) {
      handleAppointmentEdit(data);
    } else {
      handleNewAppointmentSubmit(data);
    }
  };

  const handleNewAppointmentSubmit = async (data: AppointmentForm) => {
    const res = await fetch("/api/newAppointment", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    if (!res.ok) throw new Error("Failed to add new appointment");

    await fetchAppointments();
  };

  const handleAppointmentEdit = async (data: AppointmentForm) => {
    const res = await fetch(
      `/api/updateAppointment/${selectedAppointment?.id}`,
      {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      }
    );

    if (!res.ok) throw new Error("Failed to update appointment");

    await fetchAppointments();
  };

  const handleAppointmentDoubleClick = (appt: Appointment) => {
    setSelectedAppointment(appt);
    setOpenTerminDialog(true);
  };

  const handleEmptySpaceClick = () => {
    setOpenTerminDialog(true);
  };

  return (
    <div className="max-w-6xl m-auto p-3 my-4">
      <h1 className="text-3xl text-gray-700 my-4">Terminplaner</h1>
      <div>
        <Tabs defaultValue="list">
          <div className="flex flex-wrap items-center justify-between gap-2 mb-6">
            <div className="sm:flex gap-2">
              <DatePicker date={selectedDate} setDate={setSelectedDate} />

              <TabsList className="my-4 sm:my-0">
                <TabsTrigger value="list">Liste</TabsTrigger>
                <TabsTrigger value="week">Woche</TabsTrigger>
                <TabsTrigger value="month">Monat</TabsTrigger>
              </TabsList>
            </div>

            <div className="flex gap-2">
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline">
                    <Settings2Icon className="mr-2 h-4 w-4" />
                    Termine filtern
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-72">
                  <FilterPopover
                    categories={categories}
                    patients={patients}
                    onCategoryChange={setFilterCategory}
                    onPatientChange={setFilterPatient}
                    onPatientSearch={fetchPatientBySearch}
                    setPatients={setPatients}
                  />
                </PopoverContent>
              </Popover>

              <Button onClick={() => setOpenTerminDialog(true)}>
                <PlusIcon className="mr-2 h-4 w-4" />
                Neuer Termin
              </Button>
            </div>
          </div>

          <div>
            <TabsContent value="list">
              <ListView
                appointments={filteredAppointments}
                onSelectAppointment={handleAppointmentDoubleClick}
              />
            </TabsContent>
            <TabsContent value="week">
              <WeeklyView
                selectedDate={selectedDate}
                appointments={filteredAppointments}
                onSelectAppointment={handleAppointmentDoubleClick}
                onEmptySpaceClick={handleEmptySpaceClick}
              />
            </TabsContent>
            <TabsContent value="month">
              <MonthlyView
                selectedDate={selectedDate}
                appointments={filteredAppointments}
                onSelectAppointment={handleAppointmentDoubleClick}
                onEmptySpaceClick={handleEmptySpaceClick}
              />
            </TabsContent>
          </div>
        </Tabs>
      </div>

      <AppointmentFormDialog
        open={openTerminDialog}
        onOpenChange={(open) => {
          setOpenTerminDialog(open);
          if (!open) setSelectedAppointment(null);
        }}
        appointment={selectedAppointment}
        onSubmit={handleDialogSubmit}
        categories={categories}
        patients={patients}
        onPatientSearch={fetchPatientBySearch}
        setPatients={setPatients}
      />
    </div>
  );
}
