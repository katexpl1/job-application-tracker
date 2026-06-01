import type { IApplication, IApplicationDetails } from "@/app/lib/models";
import type { CombinedForm } from "./types";

export function mapToApplicationFormValues(
  application: IApplication,
  details?: IApplicationDetails,
): CombinedForm {
  return {
    ...application,
    ...(details ?? {}),
    notes: details?.notes ?? "",
    pros: details?.pros ?? "",
    cons: details?.cons ?? "",
    rejectionReason: details?.rejectionReason ?? "",
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
