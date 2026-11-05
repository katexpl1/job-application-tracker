import { ProfileContent } from "./ProfileContent/ProfileContent";
import * as Styled from "./page.styles";

export default function ProfilePage() {
  return (
    <>
      <Styled.BackLink href="/">← Back</Styled.BackLink>
      <ProfileContent />
    </>
  );
}
