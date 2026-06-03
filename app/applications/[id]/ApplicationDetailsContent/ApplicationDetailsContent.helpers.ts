import type { IApplicationDetailsResponse } from "@/app/lib/models/responses";
import type { ApplicationForm } from "./ApplicationDetailsContent.types";

export function mapToApplicationFormValues(
  data: IApplicationDetailsResponse,
): ApplicationForm {
  return {
    companyName: data.companyName ?? "",
    appliedRole: data.appliedRole ?? "",
    location: data.location ?? "",
    jobType: data.jobType ?? "",
    dateApplied: data.dateApplied ?? "",
    source: data.source ?? "",
    salaryRange: data.salaryRange ?? "",
    status: data.status ?? "",
    contactName: data.contactName ?? "",
    jobPostingUrl: data.jobPostingUrl ?? "",
    pros: data.pros ?? "",
    cons: data.cons ?? "",
    rejectionReason: data.rejectionReason ?? "",
  };
}

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
    try {
      const url = vals.jobPostingUrl.match(/^https?:\/\//)
        ? vals.jobPostingUrl
        : `https://${vals.jobPostingUrl}`;
      new URL(url);
    } catch {
      errs.jobPostingUrl = "Must be a valid URL";
    }
  }
  return errs;
}
