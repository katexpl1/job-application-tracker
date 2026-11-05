import type { SupabaseClient } from "@supabase/supabase-js";
import { toApplicationDetailsModel } from "@/lib/applications/applications.helpers";
import type { IApplicationDetailsModel } from "@/lib/applications/applications.types";

export async function getApplicationWithDetails(
  supabase: SupabaseClient,
  id: string,
  userId: string,
): Promise<IApplicationDetailsModel | undefined> {
  const { data: application } = await supabase
    .from("applications")
    .select("*")
    .eq("id", id)
    .eq("userId", userId)
    .single();

  if (!application) {
    return undefined;
  }

  const { data: details } = await supabase
    .from("application_details")
    .select("*")
    .eq("applicationId", id)
    .maybeSingle();

  return toApplicationDetailsModel({ ...application, ...details });
}
