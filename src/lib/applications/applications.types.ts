import type { IApplicationRecord, IApplicationDetailsRecord } from "@/lib/models";
import type { IApplicationDetailsResponse } from "@/lib/models/responses";
import { ApplicationSource, ApplicationStatus, JobType } from "./applications.consts";

type FormFields = Omit<
  IApplicationDetailsResponse,
  "id" | "userId" | "applicationId" | "createdAt" | "created_at" | "coverLetter" | "notes" | "comment"
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

export interface IApplicationModel
  extends Omit<IApplicationRecord, "status" | "jobType" | "source"> {
  status: ApplicationStatus | "";
  jobType: JobType | "";
  source: ApplicationSource | "";
}

export interface IApplicationDetailsModel
  extends IApplicationModel,
    Omit<IApplicationDetailsRecord, never> {}
