import { supabase } from "@/lib/supabaseClient";
import { NextResponse } from "next/server";

export async function GET() {
  const { data, error } = await supabase.from("appointments").select(`
      *,
      patient:patients (
        id,
        email,  
        firstname,
        lastname,
        care_level
      ),
    `);

  if (error)
    return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json(data);
}
