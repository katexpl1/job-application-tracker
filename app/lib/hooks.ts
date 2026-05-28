import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type {
  IApplicationDetailsResponse,
  IApplicationResponse,
  IApplicationsResponse,
} from "./models/responses";
import type {
  ICreateApplicationRequest,
  IUpdateApplicationDetailsRequest,
  IUpdateApplicationRequest,
} from "./models/requests";

async function fetchJson<T>(url: string, options?: RequestInit): Promise<T> {
  const res = await fetch(url, options);
  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(body.error ?? `Request failed with status ${res.status}`);
  }
  return res.json();
}

const QUERY_KEY = ["applications"];

export function useApplication(id: string) {
  return useQuery<IApplicationResponse>({
    queryKey: ["applications", id],
    queryFn: () => fetchJson<IApplicationResponse>(`/api/applications/${id}`),
    enabled: !!id,
  });
}

export function useApplications() {
  return useQuery<IApplicationsResponse>({
    queryKey: QUERY_KEY,
    queryFn: () => fetchJson<IApplicationsResponse>("/api/applications"),
  });
}

export function useCreateApplication() {
  const queryClient = useQueryClient();
  return useMutation<IApplicationResponse, Error, ICreateApplicationRequest>({
    mutationFn: (body) =>
      fetchJson<IApplicationResponse>("/api/applications", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: QUERY_KEY }),
  });
}

export function useUpdateApplication() {
  const queryClient = useQueryClient();
  return useMutation<
    IApplicationResponse,
    Error,
    { id: string; body: IUpdateApplicationRequest }
  >({
    mutationFn: ({ id, body }) =>
      fetchJson<IApplicationResponse>(`/api/applications/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: QUERY_KEY }),
  });
}

export function useDeleteApplication() {
  const queryClient = useQueryClient();
  return useMutation<void, Error, string>({
    mutationFn: async (id) => {
      const res = await fetch(`/api/applications/${id}`, { method: "DELETE" });
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(
          body.error ?? `Request failed with status ${res.status}`,
        );
      }
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: QUERY_KEY }),
  });
}

export function useApplicationDetails(id: string) {
  return useQuery<IApplicationDetailsResponse>({
    queryKey: ["applications", id, "details"],
    queryFn: () =>
      fetchJson<IApplicationDetailsResponse>(`/api/applications/${id}/details`),
    enabled: !!id,
  });
}

export function useUpdateApplicationDetails() {
  const queryClient = useQueryClient();
  return useMutation<
    IApplicationDetailsResponse,
    Error,
    IUpdateApplicationDetailsRequest
  >({
    mutationFn: ({ id, ...body }) =>
      fetchJson<IApplicationDetailsResponse>(
        `/api/applications/${id}/details`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body),
        },
      ),
    onSuccess: (_data, { id }) =>
      queryClient.invalidateQueries({
        queryKey: ["applications", id, "details"],
      }),
  });
}
