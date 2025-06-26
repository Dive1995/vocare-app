# 🗓️ vocare Calendar Prototype

## ✅ Features Implemented

- Monthly, Weekly, and List views for appointments
- Hovering over an appointment shows detailed information
- clicking an appointment opens the Edit modal
- Double clicking on empty calendar cells opens the Create modal
- Create new appointment using "Neuer Termin" button
- Filtering appointments by:
  - Kategorie (Category)
  - Klient:in (Patient)
- Can search patients inside filters & appointments
- Basic form validation including start/end datetime logic
- Data is fetched per-month dynamically to reduce payload size
- Depending on the date selected Views will get updated
- Appointments are grouped by date in List view
- Appointments that are in the past is hidden in List view but can be loaded with a click
- Responsive UI with ShadCN and TailwindCSS
- Handled date and time to be specific to "Europe/Berlin" timezone

---

## 📦 Tech Stack

- **Next.js**
- **TypeScript**
- **ShadCN UI** + **Tailwind CSS**
- **Supabase**

---

## 🛠️ Improvements that can be done with more time

### 1. Application Architecture

- Introduce a global state management tool or use React useContext + useReducer for handling shared data and avoiding prop drilling

### 2. UX Enhancements

- When the user drags across time slots in the Weekly view, a new appointment modal can open pre-filled with the selected time range
- Display validation messages for each form field individually
- Improve mobile layout and interactions (eg: bottom sheet modals, better responsiveness for more mobile screens)
- Make appointments trackable by adding a status field

### 3. Data Model

- We can add explicit `patient_relatives` table to connect `patients` with `relatives` because there is currently no relation between them, which limits features like showing related people during appointment creation
- The current `appointment_assignee` table lets us assign relatives to appointments, but it doesn't enforce any database-level link
  Recommendation: we can enforce foreign key on `appointment_assignee.user` to the proper user type (e.g: relatives/doctors) and normalize users into a shared user table with roles

---

## 📁 Folder Structure

```
app/
  api/
    appointments/
      route.ts             # Fetch appointments by month
    categories/
      route.ts             # Get all categories
    newAppointment/
      route.ts             # Create new appointment
    patients/
      route.ts             # Search patients
    updateAppointment/[id]/
      route.ts             # Update appointment by ID

components/
  calendar/
    ListView.tsx
    MonthlyView.tsx
    WeeklyView.tsx
    MonthlyAppointmentBlock.tsx
    WeeklyAppointmentBlock.tsx
  AppointmentFormDialog.tsx
  AppointmentHoverCard.tsx
  DatePicker.tsx
  FilterPopover.tsx
  LoadingSpinner.tsx

lib/
  supabaseClient.ts
  appointmentService.ts   # Contains all the methods for API calls from frontend
  calendarViewUtils.ts.   # Functions that helps to place the appointments in their respective views properly
  color.ts
  utils.ts
```
