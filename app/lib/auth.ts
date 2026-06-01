import { createRouteHandlerClient } from "./supabase-server";

export const authenticateUser = async () => {
  const supabase = await createRouteHandlerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return { user, supabase };
};
