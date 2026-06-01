import type { IProfileResponse } from "@/app/lib/models/responses";
import type { ProfileForm } from "./ProfileContent.types";

export function mapProfileToFormValues(profile: IProfileResponse): ProfileForm {
  const { userId: _userId, ...rest } = profile;
  return rest;
}
