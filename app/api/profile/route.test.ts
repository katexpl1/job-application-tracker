import { HttpStatus } from "@/app/api/utils";
import { NextRequest } from "next/server";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { GET, PUT } from "./route";

const mockProfile = {
  userId: "user-1",
  firstName: "Katarzyna",
  lastName: "Kubisiak",
  title: "Frontend Developer",
  yearsOfExperience: "5",
  location: "Łódź",
};

const mockChain = {
  select: vi.fn().mockReturnThis(),
  eq: vi.fn().mockReturnThis(),
  upsert: vi.fn().mockReturnThis(),
  maybeSingle: vi.fn().mockResolvedValue({ data: mockProfile, error: null }),
  single: vi.fn().mockResolvedValue({ data: mockProfile, error: null }),
};

vi.mock("@/app/lib/auth", () => ({
  authenticateUser: vi.fn().mockResolvedValue({
    user: { id: "user-1" },
    supabase: { from: vi.fn(() => mockChain) },
  }),
}));

beforeEach(() => {
  vi.clearAllMocks();
  mockChain.select.mockReturnThis();
  mockChain.eq.mockReturnThis();
  mockChain.upsert.mockReturnThis();
  mockChain.maybeSingle.mockResolvedValue({ data: mockProfile, error: null });
  mockChain.single.mockResolvedValue({ data: mockProfile, error: null });
});

describe("GET /api/profile", () => {
  it("returns 401 when not authenticated", async () => {
    const { authenticateUser } = await import("@/app/lib/auth");
    vi.mocked(authenticateUser).mockResolvedValueOnce({ user: null, supabase: {} as never });

    const res = await GET();
    expect(res.status).toBe(HttpStatus.Unauthorized);
  });

  it("returns the profile when it exists", async () => {
    const res = await GET();
    expect(res.status).toBe(HttpStatus.OK);
    const body = await res.json();
    expect(body.firstName).toBe("Katarzyna");
  });

  it("returns empty object when no profile exists yet", async () => {
    mockChain.maybeSingle.mockResolvedValueOnce({ data: null, error: null });

    const res = await GET();
    expect(res.status).toBe(HttpStatus.OK);
    const body = await res.json();
    expect(body).toEqual({});
  });

  it("returns 500 on database error", async () => {
    mockChain.maybeSingle.mockResolvedValueOnce({ data: null, error: { message: "DB error" } });

    const res = await GET();
    expect(res.status).toBe(HttpStatus.InternalServerError);
  });
});

describe("PUT /api/profile", () => {
  it("returns 401 when not authenticated", async () => {
    const { authenticateUser } = await import("@/app/lib/auth");
    vi.mocked(authenticateUser).mockResolvedValueOnce({ user: null, supabase: {} as never });

    const req = new NextRequest("http://localhost/api/profile", {
      method: "PUT",
      body: JSON.stringify({ firstName: "Katarzyna" }),
      headers: { "Content-Type": "application/json" },
    });
    const res = await PUT(req);
    expect(res.status).toBe(HttpStatus.Unauthorized);
  });

  it("upserts and returns the profile", async () => {
    const req = new NextRequest("http://localhost/api/profile", {
      method: "PUT",
      body: JSON.stringify({ firstName: "Katarzyna", lastName: "Kubisiak" }),
      headers: { "Content-Type": "application/json" },
    });
    const res = await PUT(req);
    expect(res.status).toBe(HttpStatus.OK);
    const body = await res.json();
    expect(body.firstName).toBe("Katarzyna");
  });

  it("returns 500 on database error", async () => {
    mockChain.single.mockResolvedValueOnce({ data: null, error: { message: "DB error" } });

    const req = new NextRequest("http://localhost/api/profile", {
      method: "PUT",
      body: JSON.stringify({ firstName: "Katarzyna" }),
      headers: { "Content-Type": "application/json" },
    });
    const res = await PUT(req);
    expect(res.status).toBe(HttpStatus.InternalServerError);
  });
});
