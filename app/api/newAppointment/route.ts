import { supabase } from "@/lib/supabaseClient";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const { title, start, end, location, notes, patient, category } = body;

    // required fields validation
    if (!title || !start || !end || !patient || !category) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // start < end validation
    if (new Date(start) > new Date(end)) {
      return NextResponse.json(
        { error: "Start date can't be after end date." },
        { status: 400 }
      );
    }

    // add appointment
    const { data: newAppt, error: apptError } = await supabase
      .from("appointments")
      .insert([
        {
          title,
          start,
          end,
          location,
          notes,
          patient,
          category,
        },
      ])
      .select()
      .single();

    if (apptError || !newAppt) {
      return NextResponse.json(
        { error: apptError?.message || "Failed to create appointment" },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true, appointment: newAppt });
  } catch (err) {
    console.log(err);
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }
}
