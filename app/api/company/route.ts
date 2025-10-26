import { NextRequest, NextResponse } from "next/server";
import { createSupabaseClient } from "@/lib/supabase/server";
import { Company } from "@/lib/types";

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

  const { data: companyData, error: companyError } = await supabase
    .from("companies")
    .select("*")
    .eq("id", id)
    .single();
  if (companyError) {
    return NextResponse.json({ error: companyError.message }, { status: 500 });
  }
  return NextResponse.json({ company: companyData as Company });
}

export async function POST(request: NextRequest) {
  const {
    raw_transcript,
    deep_research_raw_output,
    consumer_acquisition_cost,
    stage,
    region,
    industry,
    revenue,
    values,
    accept,
    investor_id,
    founder_id,
  } = await request.json();
  const supabase = await createSupabaseClient();

  //   const userResponse = await supabase.auth.getUser();
  //   if (!userResponse.data.user) {
  //     return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  //   }
  const { data, error } = await supabase
    .from("companies")
    .insert({
      raw_transcript,
      deep_research_raw_output,
      consumer_acquisition_cost,
      stage,
      region,
      industry,
      revenue,
      values,
      accept,
      investor_id,
      founder_id,
    })
    .select()
    .single();
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
  return NextResponse.json({ company: data as Company });
}

export async function PUT(request: NextRequest) {
  const {
    id,
    raw_transcript,
    deep_research_raw_output,
    consumer_acquisition_cost,
    stage,
    region,
    industry,
    revenue,
    values,
    accept,
    investor_id,
    founder_id,
  } = await request.json();
  const supabase = await createSupabaseClient();
  //   const userResponse = await supabase.auth.getUser();
  //   if (!userResponse.data.user) {
  //     return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  //   }
  const { data: companyData, error: companyError } = await supabase
    .from("companies")
    .update({
      raw_transcript,
      deep_research_raw_output,
      consumer_acquisition_cost,
      stage,
      region,
      industry,
      revenue,
      values,
      accept,
      investor_id,
      founder_id,
    })
    .eq("id", id)
    .select()
    .single();
  if (companyError) {
    return NextResponse.json({ error: companyError.message }, { status: 500 });
  }
  return NextResponse.json({ company: companyData as Company });
}

export async function DELETE(request: NextRequest) {
  const { id } = await request.json();
  const supabase = await createSupabaseClient();
  const { data: companyData, error: companyError } = await supabase
    .from("companies")
    .delete()
    .eq("id", id)
    .select()
    .single();
  if (companyError) {
    return NextResponse.json({ error: companyError.message }, { status: 500 });
  }
  return NextResponse.json({ company: companyData as Company });
}
