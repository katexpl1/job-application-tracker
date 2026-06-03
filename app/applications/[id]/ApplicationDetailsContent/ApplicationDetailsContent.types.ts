import type { IApplicationDetailsResponse } from "@/app/lib/models/responses";

type FormFields = Omit<
  IApplicationDetailsResponse,
  "id" | "userId" | "applicationId" | "createdAt" | "coverLetter" | "notes" | "comment"
>;

export const EMPTY_APPLICATION_FORM = {
  companyName: "",
  appliedRole: "",
  location: "",
  jobType: "",
  dateApplied: "",
  source: "",
  salaryRange: "",
  status: "",
  contactName: "",
  jobPostingUrl: "",
  pros: "",
  cons: "",
  rejectionReason: "",
} satisfies Record<keyof FormFields, string>;

export type ApplicationForm = typeof EMPTY_APPLICATION_FORM;
