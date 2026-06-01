import type { IApplicationDetailsResponse } from "@/app/lib/models/responses";
import type { CombinedForm } from "./ApplicationDetailsContent.types";

export function mapToApplicationFormValues(
  data: IApplicationDetailsResponse,
): CombinedForm {
  return {
    ...data,
    contactName: data.contactName ?? "",
    jobPostingUrl: data.jobPostingUrl ?? "",
    comment: data.comment ?? "",
    notes: data.notes ?? "",
    pros: data.pros ?? "",
    cons: data.cons ?? "",
    rejectionReason: data.rejectionReason ?? "",
  };
}

export function validateApplication(
  vals: CombinedForm,
): Partial<Record<keyof CombinedForm, string>> {
  const errs: Partial<Record<keyof CombinedForm, string>> = {};
  if (!vals.companyName.trim()) {
    errs.companyName = "Company is required";
  }

  if (!vals.appliedRole.trim()) {
    errs.appliedRole = "Role is required";
  }

  if (vals.jobPostingUrl) {
    try {
      new URL(vals.jobPostingUrl);
    } catch {
      errs.jobPostingUrl = "Must be a valid URL";
    }
  }
  return errs;
}
