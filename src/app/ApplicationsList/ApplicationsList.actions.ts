"use server";

import { createRouteHandlerClient } from "@/lib/supabase-server";

export async function logout(): Promise<void> {
  const supabase = await createRouteHandlerClient();
  const { error } = await supabase.auth.signOut();

  if (error) {
    throw new Error(error.message);
  }
}
