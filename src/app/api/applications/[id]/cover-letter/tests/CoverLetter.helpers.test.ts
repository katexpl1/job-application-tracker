import { describe, expect, it } from "vitest";
import { buildCoverLetterPrompt } from "../CoverLetter.helpers";
import type { IApplicationRecord, IApplicationDetailsRecord } from "@/lib/models";
import { ApplicationSource, ApplicationStatus } from "@/lib/applications/applications.consts";

const mockApplication: IApplicationRecord = {
  id: "1",
  userId: "user-1",
  createdAt: null,
  companyName: "Test Corp",
  appliedRole: "Frontend Developer",
  location: "Remote",
  jobType: "full-time",
  dateApplied: "2025-01-01",
  source: ApplicationSource.LinkedIn,
  salaryRange: "100k",
  status: ApplicationStatus.Applied,
};

const mockDetails: IApplicationDetailsRecord = {
  id: "1",
  applicationId: "1",
  contactName: "Jane Smith",
  jobPostingUrl: "https://example.com/job",
  notes: "Follow up next week",
  pros: "Good culture",
  cons: "Long commute",
  rejectionReason: "",
  coverLetter: "",
  createdAt: "2025-01-01",
};

describe("buildCoverLetterPrompt", () => {
  it("includes company name and role in the prompt", () => {
    const prompt = buildCoverLetterPrompt(mockApplication);
    expect(prompt).toContain("Test Corp");
    expect(prompt).toContain("Frontend Developer");
  });

  it("includes location when provided", () => {
    const prompt = buildCoverLetterPrompt(mockApplication);
    expect(prompt).toContain("Remote");
  });

  it("shows 'not specified' for contact name when no details provided", () => {
    const prompt = buildCoverLetterPrompt(mockApplication);
    expect(prompt).toContain("not specified");
  });

  it("includes contact name from details when provided", () => {
    const prompt = buildCoverLetterPrompt(mockApplication, mockDetails);
    expect(prompt).toContain("Jane Smith");
  });

  it("includes job posting URL when provided in details", () => {
    const prompt = buildCoverLetterPrompt(mockApplication, mockDetails);
    expect(prompt).toContain("https://example.com/job");
  });

  it("omits job posting URL when not provided", () => {
    const prompt = buildCoverLetterPrompt(mockApplication);
    expect(prompt).not.toContain("Job posting:");
  });

  it("does not leak private notes into the prompt", () => {
    const prompt = buildCoverLetterPrompt(mockApplication, mockDetails);
    expect(prompt).not.toContain("Follow up next week");
  });

  it("includes pros when provided in details", () => {
    const prompt = buildCoverLetterPrompt(mockApplication, mockDetails);
    expect(prompt).toContain("Good culture");
  });

  it("works without details argument", () => {
    expect(() => buildCoverLetterPrompt(mockApplication)).not.toThrow();
  });
});
