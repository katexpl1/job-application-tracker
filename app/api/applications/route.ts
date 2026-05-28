import { supabase } from "@/app/lib/supabase";
import { errorResponse, HttpStatus } from "@/app/api/utils";
import type { IApplicationsResponse } from "@/app/lib/models/responses";
import type { ICreateApplicationRequest } from "@/app/lib/models/requests";
import type { NextRequest } from "next/server";

export async function GET() {
  const { data, error } = await supabase
    .from("applications")
    .select("*")
    .order("created_at", { ascending: true });
  if (error) {
    return errorResponse(error.message, HttpStatus.InternalServerError);
  }
  return Response.json(data as IApplicationsResponse);
}

export async function POST(request: NextRequest) {
  const body: ICreateApplicationRequest = await request.json();
  if (!body.companyName?.trim()) {
    return errorResponse("Company name is required", HttpStatus.BadRequest);
  }
  if (!body.appliedRole?.trim()) {
    return errorResponse("Role is required", HttpStatus.BadRequest);
  }
  const { data, error } = await supabase
    .from("applications")
    .insert(body)
    .select()
    .single();

  if (error) {
    return errorResponse(error.message, HttpStatus.InternalServerError);
  }
  return Response.json(data, { status: HttpStatus.Created });
}
