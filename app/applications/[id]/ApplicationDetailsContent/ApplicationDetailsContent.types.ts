const COMBINED_FORM_KEYS = [
  "companyName",
  "appliedRole",
  "location",
  "jobType",
  "dateApplied",
  "source",
  "salaryRange",
  "contactName",
  "jobPostingUrl",
  "status",
  "comment",
  "notes",
  "pros",
  "cons",
  "rejectionReason",
] as const;

export type CombinedForm = Record<(typeof COMBINED_FORM_KEYS)[number], string>;

export const EMPTY_FORM: CombinedForm = Object.fromEntries(
  COMBINED_FORM_KEYS.map((key) => [key, ""]),
) as CombinedForm;
