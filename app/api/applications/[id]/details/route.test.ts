import { NextRequest } from "next/server";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { PUT } from "./route";

const mockDetails = {
  applicationId: "1",
  notes: "Some notes",
  pros: "Good pay",
  cons: "Long commute",
  rejectionReason: "",
  coverLetter: "",
};

const mockChain = {
  select: vi.fn().mockReturnThis(),
  eq: vi.fn().mockReturnThis(),
  upsert: vi.fn().mockReturnThis(),
  single: vi.fn(),
};

vi.mock("@/app/lib/auth", () => ({
  authenticateUser: vi.fn().mockResolvedValue({
    user: { id: "user-1" },
    supabase: { from: vi.fn(() => mockChain) },
  }),
}));

const params = Promise.resolve({ id: "1" });

beforeEach(() => {
  vi.clearAllMocks();
  mockChain.select.mockReturnThis();
  mockChain.eq.mockReturnThis();
  mockChain.upsert.mockReturnThis();
  mockChain.single
    .mockResolvedValueOnce({ data: { id: "1" }, error: null })
    .mockResolvedValueOnce({ data: mockDetails, error: null });
});

describe("PUT /api/applications/[id]/details", () => {
  it("returns 401 when not authenticated", async () => {
    const { authenticateUser } = await import("@/app/lib/auth");
    vi.mocked(authenticateUser).mockResolvedValueOnce({ user: null, supabase: {} as never });

    const req = new NextRequest("http://localhost/api/applications/1/details", {
      method: "PUT",
      body: JSON.stringify({ notes: "Updated notes" }),
      headers: { "Content-Type": "application/json" },
    });
    const res = await PUT(req, { params });
    expect(res.status).toBe(401);
  });

  it("returns 404 when application does not belong to user", async () => {
    mockChain.single.mockReset();
    mockChain.single.mockResolvedValueOnce({
      data: null,
      error: { message: "Not found", code: "PGRST116" },
    });

    const req = new NextRequest("http://localhost/api/applications/1/details", {
      method: "PUT",
      body: JSON.stringify({ notes: "Updated notes" }),
      headers: { "Content-Type": "application/json" },
    });
    const res = await PUT(req, { params });
    expect(res.status).toBe(404);
  });

  it("upserts and returns details on success", async () => {
    const req = new NextRequest("http://localhost/api/applications/1/details", {
      method: "PUT",
      body: JSON.stringify({ notes: "Updated notes", pros: "Great team" }),
      headers: { "Content-Type": "application/json" },
    });
    const res = await PUT(req, { params });
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body).toEqual(mockDetails);
  });

  it("returns 500 on database error during upsert", async () => {
    mockChain.single.mockReset();
    mockChain.single
      .mockResolvedValueOnce({ data: { id: "1" }, error: null })
      .mockResolvedValueOnce({ data: null, error: { message: "DB error" } });

    const req = new NextRequest("http://localhost/api/applications/1/details", {
      method: "PUT",
      body: JSON.stringify({ notes: "Updated notes" }),
      headers: { "Content-Type": "application/json" },
    });
    const res = await PUT(req, { params });
    expect(res.status).toBe(500);
  });
});
