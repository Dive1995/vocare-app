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

import {
  fetchAppointments,
  fetchCategories,
  fetchPatients,
  addNewAppointment,
  updateAppointment,
} from "@/lib/appointmentService";
import LoadingSpinner from "@/components/LoadingSpinner";

export default function Home() {
  const timeZone = "Europe/Berlin";

  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [patients, setPatients] = useState<PatientSearchResult[]>([]);

  const [selectedDate, setSelectedDate] = useState(
    toZonedTime(new Date(), timeZone)
  );

  const [loadingAppointments, setLoadingAppointments] = useState(false);

  const [openTerminDialog, setOpenTerminDialog] = useState(false);
  const [selectedAppointment, setSelectedAppointment] =
    useState<Appointment | null>(null);

  const [filterCategory, setFilterCategory] = useState<string | null>(null);
  const [filterPatient, setFilterPatient] = useState<string | null>(null);
  const [filteredAppointments, setFilteredAppointments] = useState<
    Appointment[]
  >([]);

  useEffect(() => {
    loadAppointments();
  }, [selectedDate]);

  // fetch categories only on the first page load
  useEffect(() => {
    const loadCategories = async () => {
      try {
        const data = await fetchCategories();
        setCategories(data);
      } catch (err: any) {
        console.log("Error trying to fetch categories: ", err.message);
      }
    };

    loadCategories();
  }, []);

  // search patients
  const fetchPatientBySearch = async (search: string) => {
    try {
      const data = await fetchPatients(search);
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

  const loadAppointments = async () => {
    setLoadingAppointments(true);
    try {
      const data = await fetchAppointments(selectedDate);
      setAppointments(data);
    } catch (err: any) {
      console.log("Error trying to fetch appointments: ", err.message);
    } finally {
      setLoadingAppointments(false);
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
    try {
      await addNewAppointment(data);
      await loadAppointments();
    } catch (err: any) {
      console.log("Failed to add new appointment:", err.message);
    }
  };

  const handleAppointmentEdit = async (data: AppointmentForm) => {
    try {
      if (!selectedAppointment) return;
      await updateAppointment(selectedAppointment.id, data);
      await loadAppointments();
    } catch (err: any) {
      console.log("Failed to update appointment:", err.message);
    }
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
            {loadingAppointments ? (
              <LoadingSpinner />
            ) : (
              <TabsContent value="list">
                <ListView
                  appointments={filteredAppointments}
                  onSelectAppointment={handleAppointmentDoubleClick}
                />
              </TabsContent>
            )}
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

      <footer className="text-center text-sm text-gray-500 mt-10 border-t pt-4">
        Created by{" "}
        <a
          href="https://github.com/Dive1995"
          target="_blank"
          rel="noopener noreferrer"
          className="underline hover:text-blue-600 transition">
          Diveshan
        </a>{" "}
        •{" "}
        <a
          href="https://diveshan.netlify.app"
          target="_blank"
          rel="noopener noreferrer"
          className="underline hover:text-blue-600 transition">
          Portfolio
        </a>
      </footer>
    </div>
  );
}
