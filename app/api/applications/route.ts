import { errorResponse, HttpStatus } from "@/app/api/utils";
import type { IApplicationsResponse } from "@/app/lib/models/responses";
import type { ICreateApplicationRequest } from "@/app/lib/models/requests";
import type { NextRequest } from "next/server";
import { authenticateUser } from "@/app/lib/auth";

const SORTABLE_COLUMNS = new Set([
  "companyName", "appliedRole", "location", "jobType",
  "dateApplied", "source", "salaryRange", "status",
]);

export async function GET(request: NextRequest) {
  const { user, supabase } = await authenticateUser();

  if (!user) {
    return errorResponse("Unauthorized", HttpStatus.Unauthorized);
  }

  const { searchParams } = new URL(request.url);
  const sortKey = searchParams.get("sortKey");
  const sortDir = searchParams.get("sortDir");
  const ascending = sortDir === "asc";

  const { data, error } = await supabase
    .from("applications")
    .select("*")
    .eq("userId", user.id)
    .order(
      sortKey && SORTABLE_COLUMNS.has(sortKey) ? sortKey : "created_at",
      { ascending: sortKey ? ascending : false },
    );

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
