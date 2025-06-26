export interface Patient {
  id: string;
  firstname: string;
  lastname: string;
  birth_date: Date;
  care_level: number;
  pronoun: string;
  email: string;
}

export interface PatientSearchResult {
  id: string;
  firstname: string;
  lastname: string;
}

export interface Category {
  id: string;
  label: string;
  color: string;
}

export interface Relative {
  id: string;
  firstname: string;
  lastname: string;
  pronoun: string;
  notes: string;
}

export interface AppointmentAssignee {
  id: string;
  appointment: string;
  user_type: string;
  user: string;
}

export interface Activity {
  id: string;
  created_by: string;
  appointment: string;
  type: string;
  content: string;
}

export interface Appointment {
  id: string;
  start: string;
  end: string;
  location: string;
  patient: Patient;
  category: Category;
  attachements: [] | null;
  notes: string;
  title: string;
  activities: Activity[] | null;
}

export interface AppointmentForm {
  start: string;
  end: string;
  location: string;
  patient: string;
  category: string;
  notes: string;
  title: string;
}
