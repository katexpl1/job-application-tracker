// @vitest-environment node
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
};

vi.mock("@/app/lib/supabase", () => ({
  supabase: { from: vi.fn(() => mockChain) },
}));

const params = Promise.resolve({ id: "1" });

beforeEach(() => {
  vi.clearAllMocks();
  mockChain.single.mockResolvedValue({ data: mockApplication, error: null });
});

describe("GET /api/applications/[id]", () => {
  it("returns the application", async () => {
    const req = new NextRequest("http://localhost/api/applications/1");
    const res = await GET(req, { params });
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body).toEqual(mockApplication);
  });

  it("returns 404 on database error", async () => {
    mockChain.single.mockResolvedValue({ data: null, error: { message: "Not found" } });
    const req = new NextRequest("http://localhost/api/applications/1");
    const res = await GET(req, { params });
    expect(res.status).toBe(404);
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
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.companyName).toBe("Updated Corp");
  });
});

describe("DELETE /api/applications/[id]", () => {
  it("returns 204 on success", async () => {
    mockChain.eq.mockResolvedValue({ error: null });
    const req = new NextRequest("http://localhost/api/applications/1", {
      method: "DELETE",
    });
    const res = await DELETE(req, { params });
    expect(res.status).toBe(204);
  });

  it("returns 500 on database error", async () => {
    mockChain.eq.mockResolvedValue({ error: { message: "DB error" } });
    const req = new NextRequest("http://localhost/api/applications/1", {
      method: "DELETE",
    });
    const res = await DELETE(req, { params });
    expect(res.status).toBe(500);
  });
});
