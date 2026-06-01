import { NextRequest } from "next/server";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { GET, POST } from "./route";

const mockApplication = {
  id: "1",
  companyName: "Test Corp",
  appliedRole: "Frontend Developer",
};

const mockChain = {
  select: vi.fn().mockReturnThis(),
  order: vi.fn().mockResolvedValue({ data: [mockApplication], error: null }),
  insert: vi.fn().mockReturnThis(),
  single: vi.fn().mockResolvedValue({ data: mockApplication, error: null }),
};

vi.mock("@/app/lib/supabase", () => ({
  supabase: { from: vi.fn(() => mockChain) },
}));

beforeEach(() => {
  vi.clearAllMocks();
  mockChain.order.mockResolvedValue({ data: [mockApplication], error: null });
  mockChain.single.mockResolvedValue({ data: mockApplication, error: null });
});

describe("GET /api/applications", () => {
  it("returns list of applications", async () => {
    const res = await GET();
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body).toEqual([mockApplication]);
  });

  it("returns 500 on database error", async () => {
    mockChain.order.mockResolvedValue({
      data: null,
      error: { message: "DB error" },
    });
    const res = await GET();
    expect(res.status).toBe(500);
  });
});

describe("POST /api/applications", () => {
  it("creates an application and returns 201", async () => {
    const req = new NextRequest("http://localhost/api/applications", {
      method: "POST",
      body: JSON.stringify({ companyName: "Test Corp", appliedRole: "Dev" }),
      headers: { "Content-Type": "application/json" },
    });
    const res = await POST(req);
    expect(res.status).toBe(201);
  });

  it("returns 400 when companyName is missing", async () => {
    const req = new NextRequest("http://localhost/api/applications", {
      method: "POST",
      body: JSON.stringify({ appliedRole: "Dev" }),
      headers: { "Content-Type": "application/json" },
    });
    const res = await POST(req);
    expect(res.status).toBe(400);
    const body = await res.json();
    expect(body.error).toBe("Company name is required");
  });

  it("returns 400 when appliedRole is missing", async () => {
    const req = new NextRequest("http://localhost/api/applications", {
      method: "POST",
      body: JSON.stringify({ companyName: "Test Corp" }),
      headers: { "Content-Type": "application/json" },
    });
    const res = await POST(req);
    expect(res.status).toBe(400);
    const body = await res.json();
    expect(body.error).toBe("Role is required");
  });
});
