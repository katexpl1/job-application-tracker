import type { IApplicationRecord, IApplicationDetailsRecord } from "@/lib/models";
import { ApplicationSource, ApplicationStatus, JobType } from "./applications.consts";
import type {
  ApplicationForm,
  IApplicationDetailsModel,
  IApplicationModel,
} from "./applications.types";

export function validateApplication(
  vals: ApplicationForm,
): Partial<Record<keyof ApplicationForm, string>> {
  const errs: Partial<Record<keyof ApplicationForm, string>> = {};

  if (!vals.companyName.trim()) {
    errs.companyName = "Company is required";
  }

  if (!vals.appliedRole.trim()) {
    errs.appliedRole = "Role is required";
  }

  if (vals.jobPostingUrl) {
    const rawUrl = vals.jobPostingUrl.match(/^https?:\/\//)
      ? vals.jobPostingUrl
      : `https://${vals.jobPostingUrl}`;

    try {
      const parsedUrl = new URL(rawUrl);

      if (!parsedUrl.hostname.includes(".")) {
        errs.jobPostingUrl = "Must be a valid URL";
      }
    } catch {
      errs.jobPostingUrl = "Must be a valid URL";
    }
  }

  return errs;
}

export function toApplicationModel(api: IApplicationRecord): IApplicationModel {
  return {
    ...api,
    status: (api.status as ApplicationStatus) ?? "",
    jobType: (api.jobType as JobType) ?? "",
    source: (api.source as ApplicationSource) ?? "",
  };
}

export function toApplicationDetailsModel(
  api: IApplicationRecord & Partial<IApplicationDetailsRecord>,
): IApplicationDetailsModel {
  return {
    ...toApplicationModel(api),
    id: api.id,
    applicationId: api.applicationId ?? "",
    contactName: api.contactName ?? "",
    jobPostingUrl: api.jobPostingUrl ?? "",
    notes: api.notes ?? "",
    pros: api.pros ?? "",
    cons: api.cons ?? "",
    rejectionReason: api.rejectionReason ?? "",
    coverLetter: api.coverLetter ?? "",
    createdAt: api.createdAt ?? "",
  };
}
