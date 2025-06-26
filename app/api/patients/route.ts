import { supabase } from "@/lib/supabaseClient";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const search = body.search;

    const { error, data } = await supabase
      .from("patients")
      .select("id, firstname, lastname")
      .or(`firstname.ilike.%${search}%,lastname.ilike.%${search}%`)
      .limit(10);

    if (error)
      return NextResponse.json({ error: error.message }, { status: 500 });

    return NextResponse.json(data);
  } catch (error) {
    console.log("Search patient error: ", error);
    return NextResponse.json({
      error: "Please pass a valid search",
      status: 400,
    });
  }
}
