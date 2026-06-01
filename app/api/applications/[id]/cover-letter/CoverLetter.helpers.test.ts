import { describe, expect, it } from "vitest";
import { buildCoverLetterPrompt } from "./CoverLetter.helpers";
import type { IApplication } from "@/app/lib/models";
import type { IApplicationDetails } from "@/app/lib/models";

const mockApplication: IApplication = {
  id: "1",
  userId: "user-1",
  companyName: "Test Corp",
  appliedRole: "Frontend Developer",
  location: "Remote",
  jobType: "full-time",
  dateApplied: "2025-01-01",
  source: "linkedin",
  salaryRange: "100k",
  status: "Applied",
};

const mockDetails: IApplicationDetails = {
  applicationId: "1",
  contactName: "Jane Smith",
  jobPostingUrl: "https://example.com/job",
  comment: "Looks great",
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

  it("includes notes when provided in details", () => {
    const prompt = buildCoverLetterPrompt(mockApplication, mockDetails);
    expect(prompt).toContain("Follow up next week");
  });

  it("includes pros when provided in details", () => {
    const prompt = buildCoverLetterPrompt(mockApplication, mockDetails);
    expect(prompt).toContain("Good culture");
  });

  it("works without details argument", () => {
    expect(() => buildCoverLetterPrompt(mockApplication)).not.toThrow();
  });
});
