export interface IApplication {
  id: string;
  userId: string;
  companyName: string;
  appliedRole: string;
  location: string;
  jobType: string;
  dateApplied: string;
  source: string;
  salaryRange: string;
  status: string;
}

export interface IApplicationDetails {
  applicationId: string;
  contactName: string;
  jobPostingUrl: string;
  comment: string;
  notes: string;
  pros: string;
  cons: string;
  rejectionReason: string;
  coverLetter: string;
  createdAt: string;
}

export type Row = Omit<IApplication, "id"> & { id?: string; details?: never };
