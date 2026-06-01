import type { IApplication, IApplicationDetails, IProfile } from ".";

export type IApplicationResponse = IApplication;

export type IApplicationsResponse = IApplication[];

export type IApplicationDetailsResponse = IApplication & IApplicationDetails;

export interface ICoverLetterResponse {
  coverLetter: string;
}

export type IProfileResponse = IProfile;
