import { NextRequest, NextResponse } from "next/server";
import { createSupabaseClient } from "@/lib/supabase/server";
import { Investor } from "@/lib/types";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");

  if (!id) {
    return NextResponse.json({ error: "ID is required" }, { status: 400 });
  }

  const supabase = await createSupabaseClient();

  //   const userResponse = await supabase.auth.getUser();
  //   if (!userResponse.data.user) {
  //     return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  //   }

  const { data: investorData, error: investorError } = await supabase
    .from("investors")
    .select("*")
    .eq("id", id)
    .single();
  if (investorError) {
    return NextResponse.json({ error: investorError.message }, { status: 500 });
  }
  return NextResponse.json({ investor: investorData as Investor });
}

export async function POST(request: NextRequest) {
  const { phone_number, mandate } = await request.json();
  const supabase = await createSupabaseClient();

  //   const userResponse = await supabase.auth.getUser();
  //   if (!userResponse.data.user) {
  //     return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  //   }
  const { data, error } = await supabase
    .from("investors")
    .insert({ phone_number, mandate })
    .select()
    .single();
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
  return NextResponse.json({ investor: data as Investor });
}

export async function PUT(request: NextRequest) {
  const { id, phone_number, mandate } = await request.json();
  const supabase = await createSupabaseClient();
  //   const userResponse = await supabase.auth.getUser();
  //   if (!userResponse.data.user) {
  //     return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  //   }
  const { data: investorData, error: investorError } = await supabase
    .from("investors")
    .update({ phone_number, mandate })
    .eq("id", id)
    .select()
    .single();
  if (investorError) {
    return NextResponse.json({ error: investorError.message }, { status: 500 });
  }
  return NextResponse.json({ investor: investorData as Investor });
}

export async function DELETE(request: NextRequest) {
  const { id } = await request.json();
  const supabase = await createSupabaseClient();
  const { data: investorData, error: investorError } = await supabase
    .from("investors")
    .delete()
    .eq("id", id)
    .select()
    .single();
  if (investorError) {
    return NextResponse.json({ error: investorError.message }, { status: 500 });
  }
  return NextResponse.json({ investor: investorData as Investor });
}
