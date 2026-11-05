import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { HttpStatus } from "@/app/api/utils";
import type { IApplicationDetailsResponse } from "./models/responses";
import type { IProfile } from "./models";
import type {
  IUpdateApplicationDetailsRequest,
  IUpdateProfileRequest,
} from "./models/requests";
import type {
  IApplicationDetailsModel,
  IApplicationModel,
  ApplicationForm,
} from "@/lib/applications/applications.types";
import {
  toApplicationDetailsModel,
  toApplicationModel,
} from "@/lib/applications/applications.helpers";
import { createApplication } from "@/components/AddApplicationModal/AddApplicationModal.actions";

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

export function useApplication(id: string, initialData?: IApplicationDetailsModel) {
  return useQuery<IApplicationDetailsModel>({
    queryKey: ["applications", id],
    queryFn: () =>
      fetchJson<IApplicationDetailsResponse>(`/api/applications/${id}`).then(
        toApplicationDetailsModel,
      ),
    enabled: !!id,
    initialData,
  });
}

export function useApplications(
  sort?: { key: string; direction: "asc" | "desc" } | null,
  initialData?: IApplicationModel[],
) {
  const params = sort ? `?sortKey=${sort.key}&sortDir=${sort.direction}` : "";
  return useQuery<IApplicationModel[]>({
    queryKey: [...QUERY_KEY, sort],
    queryFn: () =>
      fetchJson<IApplicationDetailsResponse[]>(`/api/applications${params}`).then((items) =>
        items.map(toApplicationModel),
      ),
    initialData: sort ? undefined : initialData,
  });
}

export function useCreateApplication() {
  const queryClient = useQueryClient();
  return useMutation<void, Error, { form: ApplicationForm; coverLetter: string }>({
    mutationFn: ({ form, coverLetter }) => createApplication(form, coverLetter),
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

export function useProfile(initialData?: IProfile) {
  return useQuery<IProfile>({
    queryKey: ["profile"],
    queryFn: () => fetchJson<IProfile>("/api/profile"),
    initialData,
  });
}

export function useUpdateProfile() {
  const queryClient = useQueryClient();
  return useMutation<IProfile, Error, IUpdateProfileRequest>({
    mutationFn: (body) =>
      fetchJson<IProfile>("/api/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["profile"] }),
  });
}

