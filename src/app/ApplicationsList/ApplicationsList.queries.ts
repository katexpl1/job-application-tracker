import type { SupabaseClient } from "@supabase/supabase-js";
import { toApplicationModel } from "@/lib/applications/applications.helpers";
import type { IApplicationModel } from "@/lib/applications/applications.types";

export async function getApplications(
  supabase: SupabaseClient,
  userId: string,
): Promise<IApplicationModel[]> {
  const { data } = await supabase
    .from("applications")
    .select("*")
    .eq("userId", userId)
    .order("created_at", { ascending: false });

  return (data ?? []).map(toApplicationModel);
}
