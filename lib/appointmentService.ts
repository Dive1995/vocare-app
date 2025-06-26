import {
  Appointment,
  AppointmentForm,
  Category,
  PatientSearchResult,
} from "@/types/models";

const API_HEADERS = { "Content-Type": "application/json" };

export async function fetchAppointments(
  monthDate: Date
): Promise<Appointment[]> {
  const res = await fetch("/api/appointments", {
    method: "POST",
    headers: API_HEADERS,
    body: JSON.stringify({ monthDate }),
  });

  if (!res.ok) {
    throw new Error("Failed to fetch appointments");
  }
  return res.json();
}

export async function fetchCategories(): Promise<Category[]> {
  const res = await fetch("/api/categories", {
    method: "GET",
    headers: API_HEADERS,
  });

  if (!res.ok) {
    throw new Error("Failed to fetch categories");
  }
  return res.json();
}

export async function fetchPatients(
  search: string
): Promise<PatientSearchResult[]> {
  const res = await fetch("/api/patients", {
    method: "POST",
    headers: API_HEADERS,
    body: JSON.stringify({ search }),
  });

  if (!res.ok) {
    throw new Error("Failed to fetch patients");
  }
  return res.json();
}

export async function addNewAppointment(data: AppointmentForm) {
  const res = await fetch("/api/newAppointment", {
    method: "POST",
    headers: API_HEADERS,
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    throw new Error("Failed to add new appointment");
  }
}

export async function updateAppointment(id: string, data: AppointmentForm) {
  const res = await fetch(`/api/updateAppointment/${id}`, {
    method: "PATCH",
    headers: API_HEADERS,
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    throw new Error("Failed to update appointment");
  }
}
