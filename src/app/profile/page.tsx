import { authenticateUser } from "@/lib/auth";
import { ProfileContent } from "./ProfileContent/ProfileContent";
import { getProfile } from "./ProfileContent/ProfileContent.queries";
import * as Styled from "./page.styles";

export default async function ProfilePage() {
  const { user, supabase } = await authenticateUser();

  const initialData = await getProfile(supabase, user!.id);

  return (
    <>
      <Styled.BackLink href="/">← Back</Styled.BackLink>
      <ProfileContent initialData={initialData} />
    </>
  );
}
