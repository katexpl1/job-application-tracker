export enum JobType {
  Remote = "remote",
  Hybrid = "hybrid",
  OnSite = "on-site",
}

export enum ApplicationSource {
  LinkedIn = "linkedin",
  Referral = "referral",
  CompanySite = "company-site",
  Other = "other",
}

export enum ApplicationStatus {
  Applied = "Applied",
  InReview = "In review",
  Interview = "Interview",
  Offer = "Offer",
  Rejected = "Rejected",
}

export const JOB_TYPE_OPTIONS = [
  { value: JobType.Remote, label: "Remote" },
  { value: JobType.Hybrid, label: "Hybrid" },
  { value: JobType.OnSite, label: "On-site" },
];

export const SOURCE_OPTIONS = [
  { value: ApplicationSource.LinkedIn, label: "LinkedIn" },
  { value: ApplicationSource.Referral, label: "Referral" },
  { value: ApplicationSource.CompanySite, label: "Company site" },
  { value: ApplicationSource.Other, label: "Other" },
];

export const STATUS_OPTIONS = [
  { value: ApplicationStatus.Applied, label: "Applied" },
  { value: ApplicationStatus.InReview, label: "In review" },
  { value: ApplicationStatus.Interview, label: "Interview" },
  { value: ApplicationStatus.Offer, label: "Offer" },
  { value: ApplicationStatus.Rejected, label: "Rejected" },
];
