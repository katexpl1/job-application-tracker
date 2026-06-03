import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { HttpStatus } from "@/app/api/utils";
import type {
  IApplicationDetailsResponse,
  IApplicationResponse,
  IApplicationsResponse,
  IProfileResponse,
} from "./models/responses";
import type {
  ICreateApplicationRequest,
  IUpdateApplicationDetailsRequest,
  IUpdateApplicationRequest,
  IUpdateProfileRequest,
} from "./models/requests";

class ApiError extends Error {
  constructor(
    message: string,
    public status: number,
  ) {
    super(message);
  }
}

async function fetchJson<T>(url: string, options?: RequestInit): Promise<T> {
  const res = await fetch(url, options);
  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new ApiError(
      body.error ?? `Request failed with status ${res.status}`,
      res.status,
    );
  }
  if (res.status === HttpStatus.NoContent) {
    return undefined as T;
  }
  return res.json();
}

const QUERY_KEY = ["applications"];

export function useApplication(id: string) {
  return useQuery<IApplicationDetailsResponse>({
    queryKey: ["applications", id],
    queryFn: () => fetchJson<IApplicationDetailsResponse>(`/api/applications/${id}`),
    enabled: !!id,
  });
}

export function useApplications(sort?: { key: string; direction: "asc" | "desc" } | null) {
  const params = sort ? `?sortKey=${sort.key}&sortDir=${sort.direction}` : "";
  return useQuery<IApplicationsResponse>({
    queryKey: [...QUERY_KEY, sort],
    queryFn: () => fetchJson<IApplicationsResponse>(`/api/applications${params}`),
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
    mutationFn: (id) =>
      fetchJson<void>(`/api/applications/${id}`, { method: "DELETE" }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: QUERY_KEY }),
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
        queryKey: ["applications", id],
      }),
  });
}

export function useProfile() {
  return useQuery<IProfileResponse>({
    queryKey: ["profile"],
    queryFn: () => fetchJson<IProfileResponse>("/api/profile"),
  });
}

export function useUpdateProfile() {
  const queryClient = useQueryClient();
  return useMutation<IProfileResponse, Error, IUpdateProfileRequest>({
    mutationFn: (body) =>
      fetchJson<IProfileResponse>("/api/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["profile"] }),
  });
}

