import { describe, expect, it } from "vitest";
import { mapProfileToFormValues } from "./ProfileContent.helpers";
import type { IProfileResponse } from "@/app/lib/models/responses";
import { EMPTY_PROFILE_FORM } from "./ProfileContent.types";

const mockProfile: IProfileResponse = {
  userId: "user-1",
  firstName: "Katarzyna",
  lastName: "Kubisiak",
  title: "Frontend Developer",
  yearsOfExperience: "5",
  location: "Łódź",
  bio: "Passionate frontend developer",
  skills: "React, TypeScript, Next.js",
  linkedIn: "https://linkedin.com/in/katarzyna",
  github: "https://github.com/katexpl1",
  portfolioUrl: "https://katexpl.dev",
};

describe("mapProfileToFormValues", () => {
  it("maps all profile fields to the form", () => {
    const form = mapProfileToFormValues(mockProfile);

    expect(form.firstName).toBe("Katarzyna");
    expect(form.lastName).toBe("Kubisiak");
    expect(form.title).toBe("Frontend Developer");
    expect(form.yearsOfExperience).toBe("5");
    expect(form.location).toBe("Łódź");
    expect(form.bio).toBe("Passionate frontend developer");
    expect(form.skills).toBe("React, TypeScript, Next.js");
    expect(form.linkedIn).toBe("https://linkedin.com/in/katarzyna");
    expect(form.github).toBe("https://github.com/katexpl1");
    expect(form.portfolioUrl).toBe("https://katexpl.dev");
  });

  it("does not include userId in the form", () => {
    const form = mapProfileToFormValues(mockProfile);
    expect(form).not.toHaveProperty("userId");
  });

  it("returns empty strings for all fields when profile has no data", () => {
    const emptyProfile = { userId: "user-1" } as unknown as IProfileResponse;
    const form = mapProfileToFormValues(emptyProfile);

    Object.values(form).forEach((value) => {
      expect(value ?? "").toBe("");
    });
  });

  it("matches the shape of EMPTY_PROFILE_FORM", () => {
    const form = mapProfileToFormValues(mockProfile);
    expect(Object.keys(form)).toEqual(Object.keys(EMPTY_PROFILE_FORM));
  });
});
