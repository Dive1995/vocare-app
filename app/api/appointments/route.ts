import { supabase } from "@/lib/supabaseClient";
import { NextResponse } from "next/server";
import { startOfMonth, endOfMonth, subWeeks, addWeeks } from "date-fns";

// get appointment data with patient, and category details
// we want only the current viewing month's appointments
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const monthDate = new Date(body.monthDate);

    const monthStart = startOfMonth(monthDate);
    const monthEnd = endOfMonth(monthDate);

    // fixes the edge case where the previous/next month days aren't showing any appointments in the views
    const start = subWeeks(monthStart, 1).toISOString();
    const end = addWeeks(monthEnd, 1).toISOString();

    const { data, error } = await supabase
      .from("appointments")
      .select(
        `
    *,
    patient:patients (id, firstname, lastname, pronoun, care_level, email, birth_date),
    category:categories (id, label, color),
    activities:activities (id, appointment, type, content)
  `
      )
      .gte("start", start)
      .lte("start", end);

    if (error)
      return NextResponse.json({ error: error.message }, { status: 500 });

    return NextResponse.json(data);
  } catch (error) {
    console.log("Appointment POST request error: ", error);
    return NextResponse.json(
      { error: "Please pass valid date" },
      { status: 400 }
    );
  }
}
