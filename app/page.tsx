"use client";

import MonthlyView from "@/components/calendar/MonthlyView";
import WeeklyView from "@/components/calendar/WeeklyView";

// import { useEffect, useState } from "react";

export default function Home() {
  // const [appointments, setAppointments] = useState([]);
  // const [error, setError] = useState(null);

  // useEffect(() => {
  //   const fetchAppointments = async () => {
  //     try {
  //       const res = await fetch("/api/appointments");
  //       if (!res.ok) throw new Error("Failed to fetch appointments");

  //       const data = await res.json();
  //       console.log("Appointments: ", data);
  //       setAppointments(data);
  //       // eslint-disable-next-line @typescript-eslint/no-explicit-any
  //     } catch (err: any) {
  //       setError(err.message);
  //     }
  //   };

  //   fetchAppointments();
  // }, []);

  return (
    <div className="max-w-6xl m-auto p-3 my-4">
      <h1 className="text-3xl text-gray-700">Terminnen</h1>
      <div>
        {/* Date */}
        {/* Calendar Tabs with views */}
        {/* Filter & Button */}
      </div>

      <div>
        {/* <MonthlyView /> */}
        <WeeklyView />
      </div>
    </div>
  );
}
