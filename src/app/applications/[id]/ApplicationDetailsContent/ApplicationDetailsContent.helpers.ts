import type { IApplicationDetailsModel } from "@/lib/applications/applications.types";
import type { ApplicationForm } from "@/lib/applications/applications.types";

export function mapToApplicationFormValues(
  data: IApplicationDetailsModel,
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
