import { NextRequest, NextResponse } from "next/server";
import { createSupabaseClient } from "@/lib/supabase/server";
import { Founder } from "@/lib/types";

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

  const { data: founderData, error: founderError } = await supabase
    .from("founders")
    .select("*")
    .eq("id", id)
    .single();
  if (founderError) {
    return NextResponse.json({ error: founderError.message }, { status: 500 });
  }
  return NextResponse.json({ founder: founderData as Founder });
}

export async function POST(request: NextRequest) {
  const { name, pedigree, profile, repeat_founder, social_capital } =
    await request.json();
  const supabase = await createSupabaseClient();

  //   const userResponse = await supabase.auth.getUser();
  //   if (!userResponse.data.user) {
  //     return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  //   }
  const { data, error } = await supabase
    .from("founders")
    .insert({ name, pedigree, profile, repeat_founder, social_capital })
    .select()
    .single();
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
  return NextResponse.json({ founder: data as Founder });
}

export async function PUT(request: NextRequest) {
  const { id, name, pedigree, profile, repeat_founder, social_capital } =
    await request.json();
  const supabase = await createSupabaseClient();
  //   const userResponse = await supabase.auth.getUser();
  //   if (!userResponse.data.user) {
  //     return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  //   }
  const { data: founderData, error: founderError } = await supabase
    .from("founders")
    .update({ name, pedigree, profile, repeat_founder, social_capital })
    .eq("id", id)
    .select()
    .single();
  if (founderError) {
    return NextResponse.json({ error: founderError.message }, { status: 500 });
  }
  return NextResponse.json({ founder: founderData as Founder });
}

export async function DELETE(request: NextRequest) {
  const { id } = await request.json();
  const supabase = await createSupabaseClient();
  const { data: founderData, error: founderError } = await supabase
    .from("founders")
    .delete()
    .eq("id", id)
    .select()
    .single();
  if (founderError) {
    return NextResponse.json({ error: founderError.message }, { status: 500 });
  }
  return NextResponse.json({ founder: founderData as Founder });
}
