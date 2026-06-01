import { describe, expect, it } from "vitest";
import { mapToApplicationFormValues, validateApplication } from "./ApplicationDetailsContent.helpers";
import type { IApplicationDetailsResponse } from "@/app/lib/models/responses";
import { EMPTY_FORM } from "./ApplicationDetailsContent.types";

const mockResponse: IApplicationDetailsResponse = {
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
  applicationId: "1",
  contactName: "John Doe",
  jobPostingUrl: "https://example.com/job",
  comment: "Great opportunity",
  notes: "Follow up in 2 weeks",
  pros: "Good pay",
  cons: "Long commute",
  rejectionReason: "",
  coverLetter: "Dear Hiring Manager...",
  createdAt: "2025-01-01",
};

describe("mapToApplicationFormValues", () => {
  it("maps all fields from the response to the form", () => {
    const form = mapToApplicationFormValues(mockResponse);

    expect(form.companyName).toBe("Test Corp");
    expect(form.appliedRole).toBe("Frontend Developer");
    expect(form.contactName).toBe("John Doe");
    expect(form.notes).toBe("Follow up in 2 weeks");
    expect(form.pros).toBe("Good pay");
  });

  it("falls back to empty string when nullable fields are null", () => {
    const response = {
      ...mockResponse,
      contactName: null,
      jobPostingUrl: null,
      comment: null,
      notes: null,
      pros: null,
      cons: null,
      rejectionReason: null,
    } as unknown as IApplicationDetailsResponse;

    const form = mapToApplicationFormValues(response);

    expect(form.contactName).toBe("");
    expect(form.jobPostingUrl).toBe("");
    expect(form.comment).toBe("");
    expect(form.notes).toBe("");
    expect(form.pros).toBe("");
    expect(form.cons).toBe("");
    expect(form.rejectionReason).toBe("");
  });
});

describe("validateApplication", () => {
  it("returns no errors for a valid form", () => {
    const errors = validateApplication({
      ...EMPTY_FORM,
      companyName: "Test Corp",
      appliedRole: "Developer",
    });

    expect(errors).toEqual({});
  });

  it("returns error when companyName is empty", () => {
    const errors = validateApplication({ ...EMPTY_FORM, appliedRole: "Developer" });
    expect(errors.companyName).toBe("Company is required");
  });

  it("returns error when companyName is whitespace only", () => {
    const errors = validateApplication({ ...EMPTY_FORM, companyName: "   ", appliedRole: "Developer" });
    expect(errors.companyName).toBe("Company is required");
  });

  it("returns error when appliedRole is empty", () => {
    const errors = validateApplication({ ...EMPTY_FORM, companyName: "Test Corp" });
    expect(errors.appliedRole).toBe("Role is required");
  });

  it("returns error for invalid job posting URL", () => {
    const errors = validateApplication({
      ...EMPTY_FORM,
      companyName: "Test Corp",
      appliedRole: "Developer",
      jobPostingUrl: "not-a-url",
    });
    expect(errors.jobPostingUrl).toBe("Must be a valid URL");
  });

  it("returns no URL error when jobPostingUrl is empty", () => {
    const errors = validateApplication({
      ...EMPTY_FORM,
      companyName: "Test Corp",
      appliedRole: "Developer",
      jobPostingUrl: "",
    });
    expect(errors.jobPostingUrl).toBeUndefined();
  });

  it("returns no URL error for a valid URL", () => {
    const errors = validateApplication({
      ...EMPTY_FORM,
      companyName: "Test Corp",
      appliedRole: "Developer",
      jobPostingUrl: "https://example.com/job",
    });
    expect(errors.jobPostingUrl).toBeUndefined();
  });
});
