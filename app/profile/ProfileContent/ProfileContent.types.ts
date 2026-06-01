import type { IProfile } from "@/app/lib/models";

export const EMPTY_PROFILE_FORM = {
  firstName: "",
  lastName: "",
  title: "",
  yearsOfExperience: "",
  location: "",
  bio: "",
  skills: "",
  linkedIn: "",
  github: "",
  portfolioUrl: "",
} satisfies Record<keyof Omit<IProfile, "userId">, string>;

export type ProfileForm = typeof EMPTY_PROFILE_FORM;
