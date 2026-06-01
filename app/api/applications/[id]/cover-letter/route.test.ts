import { NextRequest } from "next/server";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { GET } from "./route";


const { mockStream, mockMessagesStream } = vi.hoisted(() => {
  const mockStream = {
    on: vi.fn().mockImplementation((event: string, cb: (text: string) => void) => {
      if (event === "text") {
        cb("Dear Hiring Manager,");
        cb(" I am writing to apply.");
      }
      return mockStream;
    }),
    finalMessage: vi.fn().mockResolvedValue({}),
  };
  const mockMessagesStream = vi.fn().mockReturnValue(mockStream);
  return { mockStream, mockMessagesStream };
});

vi.mock("@anthropic-ai/sdk", () => ({
  default: class Anthropic {
    messages = { stream: mockMessagesStream };
  },
}));

const mockApplication = {
  id: "1",
  companyName: "Test Corp",
  appliedRole: "Frontend Developer",
  location: "Remote",
  jobType: "full-time",
  userId: "user-1",
};

const mockSupabaseChain = {
  select: vi.fn().mockReturnThis(),
  eq: vi.fn().mockReturnThis(),
  single: vi.fn().mockResolvedValue({ data: mockApplication, error: null }),
  maybeSingle: vi.fn().mockResolvedValue({ data: null, error: null }),
};

vi.mock("@/app/lib/auth", () => ({
  authenticateUser: vi.fn().mockResolvedValue({
    user: { id: "user-1" },
    supabase: { from: vi.fn(() => mockSupabaseChain) },
  }),
}));

const params = Promise.resolve({ id: "1" });

beforeEach(() => {
  vi.clearAllMocks();
  mockSupabaseChain.select.mockReturnThis();
  mockSupabaseChain.eq.mockReturnThis();
  mockSupabaseChain.single.mockResolvedValue({ data: mockApplication, error: null });
  mockSupabaseChain.maybeSingle.mockResolvedValue({ data: null, error: null });
  mockStream.on.mockImplementation((event: string, cb: (text: string) => void) => {
    if (event === "text") {
      cb("Dear Hiring Manager,");
    }
    return mockStream;
  });
  mockStream.finalMessage.mockResolvedValue({});
});

describe("GET /api/applications/[id]/cover-letter", () => {
  it("returns 401 when not authenticated", async () => {
    const { authenticateUser } = await import("@/app/lib/auth");
    vi.mocked(authenticateUser).mockResolvedValueOnce({ user: null, supabase: {} as never });

    const req = new NextRequest("http://localhost/api/applications/1/cover-letter");
    const res = await GET(req, { params });
    expect(res.status).toBe(401);
  });

  it("returns 404 when application not found", async () => {
    mockSupabaseChain.single.mockResolvedValueOnce({
      data: null,
      error: { message: "Not found", code: "PGRST116" },
    });

    const req = new NextRequest("http://localhost/api/applications/1/cover-letter");
    const res = await GET(req, { params });
    expect(res.status).toBe(404);
  });

  it("returns a streaming text response on success", async () => {
    const req = new NextRequest("http://localhost/api/applications/1/cover-letter");
    const res = await GET(req, { params });

    expect(res.status).toBe(200);
    expect(res.headers.get("Content-Type")).toBe("text/plain; charset=utf-8");
    expect(res.body).not.toBeNull();
  });

  it("streams the generated cover letter text", async () => {
    const req = new NextRequest("http://localhost/api/applications/1/cover-letter");
    const res = await GET(req, { params });

    const text = await res.text();
    expect(text).toContain("Dear Hiring Manager,");
  });
});
