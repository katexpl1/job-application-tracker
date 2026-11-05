import { authenticateUser } from "@/lib/auth";
import { redirect } from "next/navigation";
import { ApplicationDetailsContent } from "./ApplicationDetailsContent/ApplicationDetailsContent";
import { getApplicationWithDetails } from "./ApplicationDetailsContent/ApplicationDetailsContent.queries";
import * as Styled from "./page.styles";

export default async function ApplicationPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const { user, supabase } = await authenticateUser();

  if (!user) {
    redirect("/login");
  }

  const initialData = await getApplicationWithDetails(supabase, id, user.id);

  return (
    <Styled.PageWrapper>
      <Styled.BackLink href="/">← Back</Styled.BackLink>
      <ApplicationDetailsContent id={id} initialData={initialData} />
    </Styled.PageWrapper>
  );
}
