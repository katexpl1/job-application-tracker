import type { IApplicationRecord } from ".";

export type ICreateApplicationRequest = Pick<IApplicationRecord, "companyName" | "appliedRole"> &
  Partial<Omit<IApplicationRecord, "id" | "userId" | "companyName" | "appliedRole">>;

export type IUpdateApplicationRequest = Partial<ICreateApplicationRequest>;

export interface ICoverLetterRequest {
  id: string;
}

export interface IUpdateProfileRequest {
  firstName?: string;
  lastName?: string;
  title?: string;
  yearsOfExperience?: string;
  location?: string;
  bio?: string;
  skills?: string;
  linkedIn?: string;
  github?: string;
  portfolioUrl?: string;
}

export interface IUpdateApplicationDetailsRequest {
  id: string;
  contactName?: string;
  jobPostingUrl?: string;
  notes?: string;
  pros?: string;
  cons?: string;
  rejectionReason?: string;
  coverLetter?: string;
}
