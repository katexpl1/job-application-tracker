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

export interface IProfile {
  userId: string;
  firstName: string;
  lastName: string;
  title: string;
  yearsOfExperience: string;
  location: string;
  bio: string;
  skills: string;
  linkedIn: string;
  github: string;
  portfolioUrl: string;
}
