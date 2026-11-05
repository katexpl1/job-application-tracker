import type { IProfile } from "@/lib/models";
import type { ProfileForm } from "./ProfileContent.types";

export function mapProfileToFormValues(profile: IProfile): ProfileForm {
  return {
    firstName: profile.firstName ?? "",
    lastName: profile.lastName ?? "",
    title: profile.title ?? "",
    yearsOfExperience: profile.yearsOfExperience ?? "",
    location: profile.location ?? "",
    bio: profile.bio ?? "",
    skills: profile.skills ?? "",
    linkedIn: profile.linkedIn ?? "",
    github: profile.github ?? "",
    portfolioUrl: profile.portfolioUrl ?? "",
  };
}
