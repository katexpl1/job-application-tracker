import { authenticateUser } from "@/lib/auth";
import { redirect } from "next/navigation";
import { ApplicationsList } from "./ApplicationsList/ApplicationsList";
import { getApplications } from "./ApplicationsList/ApplicationsList.queries";

export default async function HomePage() {
  const { user, supabase } = await authenticateUser();

  if (!user) {
    redirect("/login");
  }

  const initialData = await getApplications(supabase, user.id);

  return <ApplicationsList initialData={initialData} />;
}
