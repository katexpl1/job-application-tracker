import { http, HttpResponse } from "msw";
import { HttpStatus } from "@/app/api/utils";

export const mockApplication = {
  id: "1",
  companyName: "Test Corp",
  appliedRole: "Frontend Developer",
  location: "Remote",
  jobType: "remote",
  dateApplied: "2025-01-01",
  source: "linkedin",
  salaryRange: "100k",
  contactName: "John Doe",
  jobPostingUrl: "https://example.com/job",
  status: "Applied",
  comment: "",
};

export const mockDetails = {
  applicationId: "1",
  notes: "Some notes",
  pros: "Good pay",
  cons: "Long commute",
  rejectionReason: "",
  createdAt: "2025-01-01",
};

export const handlers = [
  http.get("/api/applications", () => {
    return HttpResponse.json([mockApplication]);
  }),

  http.get("/api/applications/:id", ({ params }) => {
    return HttpResponse.json({ ...mockApplication, id: params.id });
  }),

  http.post("/api/applications", async ({ request }) => {
    const body = await request.json();
    return HttpResponse.json({ body, id: "new-id" }, { status: HttpStatus.Created });
  }),

  http.put("/api/applications/:id", async ({ params, request }) => {
    const body = await request.json();
    return HttpResponse.json({ ...mockApplication, body, id: params.id });
  }),

  http.delete("/api/applications/:id", () => {
    return new HttpResponse(null, { status: HttpStatus.NoContent });
  }),

  http.get("/api/applications/:id/details", () => {
    return HttpResponse.json(mockDetails);
  }),

  http.put("/api/applications/:id/details", async ({ request }) => {
    const body = await request.json();
    return HttpResponse.json({ ...mockDetails, body });
  }),
];
