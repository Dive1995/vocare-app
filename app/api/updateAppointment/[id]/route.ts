import { NextRequest } from "next/server";
import { supabase } from "@/lib/supabaseClient";
import { NextResponse } from "next/server";

// type UpdateContext = {
//   params: {
//     id: string;
//   };
// };

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function PATCH(req: NextRequest, context: any) {
  try {
    const { id } = context.params;
    const body = await req.json();

    const { title, start, end, location, notes, patient, category } = body;

    if (!id || !title || !start || !end || !patient || !category) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    if (new Date(start) > new Date(end)) {
      return NextResponse.json(
        { error: "Start date can't be after end date." },
        { status: 400 }
      );
    }

    const { data: updatedAppt, error } = await supabase
      .from("appointments")
      .update({
        title,
        start,
        end,
        location,
        notes,
        patient,
        category,
      })
      .eq("id", id)
      .select()
      .single();

    if (error || !updatedAppt) {
      return NextResponse.json(
        { error: error?.message || "Failed to update appointment" },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true, appointment: updatedAppt });
  } catch (err) {
    console.error("PATCH error:", err);
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }
}
