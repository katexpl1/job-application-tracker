import { errorResponse, HttpStatus } from "@/app/api/utils";
import { authenticateUser } from "@/lib/auth";
import type { IUpdateProfileRequest } from "@/lib/models/requests";
import type { IProfile } from "@/lib/models";
import type { NextRequest } from "next/server";

export async function GET() {
  const { user, supabase } = await authenticateUser();

  if (!user) {
    return errorResponse("Unauthorized", HttpStatus.Unauthorized);
  }

  const { data, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("userId", user.id)
    .maybeSingle();

  if (error) {
    return errorResponse(error.message, HttpStatus.InternalServerError);
  }

  return Response.json((data ?? {}) as IProfile);
}

export async function PUT(request: NextRequest) {
  const { user, supabase } = await authenticateUser();

  if (!user) {
    return errorResponse("Unauthorized", HttpStatus.Unauthorized);
  }

  const body: IUpdateProfileRequest = await request.json();

  const { data, error } = await supabase
    .from("profiles")
    .upsert({ userId: user.id, ...body }, { onConflict: "userId" })
    .select()
    .single();

  if (error) {
    return errorResponse(error.message, HttpStatus.InternalServerError);
  }

  return Response.json(data as IProfile);
}
