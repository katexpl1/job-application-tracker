import type { SupabaseClient } from "@supabase/supabase-js";
import type { IProfile } from "@/lib/models";

export async function getProfile(
  supabase: SupabaseClient,
  userId: string,
): Promise<IProfile | undefined> {
  const { data } = await supabase
    .from("profiles")
    .select("*")
    .eq("userId", userId)
    .maybeSingle();

  return data ?? undefined;
}
