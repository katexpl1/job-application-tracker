import { errorResponse, HttpStatus } from "@/app/api/utils";
import type { IApplicationsResponse } from "@/app/lib/models/responses";
import type { ICreateApplicationRequest } from "@/app/lib/models/requests";
import type { NextRequest } from "next/server";
import { authenticateUser } from "@/app/lib/auth";

export async function GET() {
  const { user, supabase } = await authenticateUser();

  if (!user) {
    return errorResponse("Unauthorized", HttpStatus.Unauthorized);
  }

  const { data, error } = await supabase
    .from("applications")
    .select("*")
    .eq("userId", user.id)
    .order("created_at", { ascending: true });

  if (error) {
    return errorResponse(error.message, HttpStatus.InternalServerError);
  }

  return Response.json(data as IApplicationsResponse);
}

export async function POST(request: NextRequest) {
  const { user, supabase } = await authenticateUser();

  if (!user) {
    return errorResponse("Unauthorized", HttpStatus.Unauthorized);
  }

  const body: ICreateApplicationRequest = await request.json();

  if (!body.companyName?.trim()) {
    return errorResponse("Company name is required", HttpStatus.BadRequest);
  }

  if (!body.appliedRole?.trim()) {
    return errorResponse("Role is required", HttpStatus.BadRequest);
  }

  const {
    companyName,
    appliedRole,
    location,
    jobType,
    dateApplied,
    source,
    salaryRange,
    status,
  } = body;

  const { data, error } = await supabase
    .from("applications")
    .insert({
      companyName,
      appliedRole,
      location,
      jobType,
      dateApplied,
      source,
      salaryRange,
      status,
      userId: user.id,
    })
    .select()
    .single();

  if (error) {
    return errorResponse(error.message, HttpStatus.InternalServerError);
  }

  return Response.json(data, { status: HttpStatus.Created });
}
