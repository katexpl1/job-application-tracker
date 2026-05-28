export interface IApplication {
  id: string;
  companyName: string;
  appliedRole: string;
  location: string;
  jobType: string;
  dateApplied: string;
  source: string;
  salaryRange: string;
  contactName: string;
  jobPostingUrl: string;
  status: string;
  comment: string;
}

export interface IApplicationDetails {
  applicationId: string;
  notes: string;
  pros: string;
  cons: string;
  rejectionReason: string;
  createdAt: string;
}

export type Row = Omit<IApplication, "id"> & { id?: string; details?: never };
