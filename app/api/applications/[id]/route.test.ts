import { HttpStatus } from "@/app/api/utils";
import { NextRequest } from "next/server";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { DELETE, GET, PUT } from "./route";

const mockApplication = {
  id: "1",
  companyName: "Test Corp",
  appliedRole: "Frontend Developer",
};

const mockChain = {
  select: vi.fn().mockReturnThis(),
  update: vi.fn().mockReturnThis(),
  delete: vi.fn().mockReturnThis(),
  eq: vi.fn().mockReturnThis(),
  single: vi.fn().mockResolvedValue({ data: mockApplication, error: null }),
  maybeSingle: vi.fn().mockResolvedValue({ data: null, error: null }),
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
  mockChain.update.mockReturnThis();
  mockChain.delete.mockReturnThis();
  mockChain.eq.mockReturnThis();
  mockChain.single.mockResolvedValue({ data: mockApplication, error: null });
  mockChain.maybeSingle.mockResolvedValue({ data: null, error: null });
});

describe("GET /api/applications/[id]", () => {
  it("returns the application with details merged", async () => {
    const req = new NextRequest("http://localhost/api/applications/1");
    const res = await GET(req, { params });
    expect(res.status).toBe(HttpStatus.OK);
    const body = await res.json();
    expect(body.companyName).toBe("Test Corp");
  });

  it("returns 404 when application not found", async () => {
    mockChain.single.mockResolvedValueOnce({
      data: null,
      error: { message: "Not found", code: "PGRST116" },
    });
    const req = new NextRequest("http://localhost/api/applications/1");
    const res = await GET(req, { params });
    expect(res.status).toBe(HttpStatus.NotFound);
  });
});

describe("PUT /api/applications/[id]", () => {
  it("updates and returns the application", async () => {
    const updated = { ...mockApplication, companyName: "Updated Corp" };
    mockChain.single.mockResolvedValue({ data: updated, error: null });
    const req = new NextRequest("http://localhost/api/applications/1", {
      method: "PUT",
      body: JSON.stringify({ companyName: "Updated Corp" }),
      headers: { "Content-Type": "application/json" },
    });
    const res = await PUT(req, { params });
    expect(res.status).toBe(HttpStatus.OK);
    const body = await res.json();
    expect(body.companyName).toBe("Updated Corp");
  });

  it("returns 500 on database error", async () => {
    mockChain.single.mockResolvedValue({ data: null, error: { message: "DB error" } });
    const req = new NextRequest("http://localhost/api/applications/1", {
      method: "PUT",
      body: JSON.stringify({ companyName: "Updated Corp" }),
      headers: { "Content-Type": "application/json" },
    });
    const res = await PUT(req, { params });
    expect(res.status).toBe(HttpStatus.InternalServerError);
  });
});

describe("DELETE /api/applications/[id]", () => {
  it("returns 204 on success", async () => {
    mockChain.eq
      .mockReturnValueOnce(mockChain)
      .mockResolvedValueOnce({ error: null });
    const req = new NextRequest("http://localhost/api/applications/1", { method: "DELETE" });
    const res = await DELETE(req, { params });
    expect(res.status).toBe(HttpStatus.NoContent);
  });

  it("returns 500 on database error", async () => {
    mockChain.eq
      .mockReturnValueOnce(mockChain)
      .mockResolvedValueOnce({ error: { message: "DB error" } });
    const req = new NextRequest("http://localhost/api/applications/1", { method: "DELETE" });
    const res = await DELETE(req, { params });
    expect(res.status).toBe(HttpStatus.InternalServerError);
  });
});
