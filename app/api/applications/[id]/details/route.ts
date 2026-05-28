import { supabase } from "@/app/lib/supabase";
import { errorResponse, HttpStatus } from "@/app/api/utils";
import type { IApplicationDetailsResponse } from "@/app/lib/models/responses";
import type { IUpdateApplicationDetailsRequest } from "@/app/lib/models/requests";
import type { NextRequest } from "next/server";

const emptyDetails = {
  notes: "",
  pros: "",
  cons: "",
  rejectionReason: "",
};

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const { data, error } = await supabase
    .from("application_details")
    .select("*")
    .eq("applicationId", id)
    .maybeSingle();
  if (error) {
    return errorResponse(error.message, HttpStatus.InternalServerError);
  }
  return Response.json((data ?? emptyDetails) as IApplicationDetailsResponse);
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const { id: _id, ...body }: IUpdateApplicationDetailsRequest =
    await request.json();
  const { data, error } = await supabase
    .from("application_details")
    .upsert({ applicationId: id, ...body }, { onConflict: "applicationId" })
    .select()
    .single();
  if (error) {
    return errorResponse(error.message, HttpStatus.InternalServerError);
  }
  return Response.json(data as IApplicationDetailsResponse);
}
