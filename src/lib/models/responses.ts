import type { IApplicationRecord, IApplicationDetailsRecord } from ".";

export type IApplicationDetailsResponse = IApplicationRecord & IApplicationDetailsRecord;

export interface ICoverLetterResponse {
  coverLetter: string;
}
