import { supabase } from "@/app/lib/supabase";
import { errorResponse, HttpStatus } from "@/app/api/utils";
import type { IApplicationResponse } from "@/app/lib/models/responses";
import type { IUpdateApplicationRequest } from "@/app/lib/models/requests";
import type { NextRequest } from "next/server";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const { data, error } = await supabase
    .from("applications")
    .select("*")
    .eq("id", id)
    .single();
  if (error) {
    return errorResponse(error.message, HttpStatus.NotFound);
  }
  return Response.json(data as IApplicationResponse);
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const body: IUpdateApplicationRequest = await request.json();
  const { data, error } = await supabase
    .from("applications")
    .update(body)
    .eq("id", id)
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
  const { id } = await params;
  const { error } = await supabase.from("applications").delete().eq("id", id);
  if (error) {
    return errorResponse(error.message, HttpStatus.InternalServerError);
  }
  return new Response(null, { status: HttpStatus.NoContent });
}
