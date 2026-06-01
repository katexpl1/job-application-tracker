import { errorResponse, HttpStatus } from "@/app/api/utils";
import type { IApplicationDetailsResponse, IApplicationResponse } from "@/app/lib/models/responses";
import type { IUpdateApplicationRequest } from "@/app/lib/models/requests";
import type { NextRequest } from "next/server";
import { authenticateUser } from "@/app/lib/auth";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { user, supabase } = await authenticateUser();

  if (!user) {
    return errorResponse("Unauthorized", HttpStatus.Unauthorized);
  }

  const { id } = await params;
  const { data: application, error } = await supabase
    .from("applications")
    .select("*")
    .eq("id", id)
    .eq("userId", user.id)
    .single();

  if (error) {
    const status =
      error.code === "PGRST116"
        ? HttpStatus.NotFound
        : HttpStatus.InternalServerError;

    return errorResponse(error.message, status);
  }

  const { data: details } = await supabase
    .from("application_details")
    .select("*")
    .eq("applicationId", id)
    .maybeSingle();

  return Response.json({ ...application, ...details } as IApplicationDetailsResponse);
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { user, supabase } = await authenticateUser();

  if (!user) {
    return errorResponse("Unauthorized", HttpStatus.Unauthorized);
  }

  const { id } = await params;
  const body: IUpdateApplicationRequest = await request.json();

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
    .update({
      companyName,
      appliedRole,
      location,
      jobType,
      dateApplied,
      source,
      salaryRange,
      status,
    })
    .eq("id", id)
    .eq("userId", user.id)
    .select()
    .single();
  if (error) {
    return errorResponse(error.message, HttpStatus.InternalServerError);
  }
  return Response.json(data as IApplicationResponse);
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { user, supabase } = await authenticateUser();

  if (!user) {
    return errorResponse("Unauthorized", HttpStatus.Unauthorized);
  }

  const { id } = await params;
  const { error } = await supabase
    .from("applications")
    .delete()
    .eq("id", id)
    .eq("userId", user.id);

  if (error) {
    return errorResponse(error.message, HttpStatus.InternalServerError);
  }
  return new Response(null, { status: HttpStatus.NoContent });
}
