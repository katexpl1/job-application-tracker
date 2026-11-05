import { useState } from "react";
import { useToast } from "blunt-ui";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { HttpStatus } from "@/app/api/utils";
import type { IApplicationRecord } from "@/lib/models";
import type { IUpdateApplicationRequest } from "@/lib/models/requests";

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

export function useUpdateApplication() {
  const queryClient = useQueryClient();
  return useMutation<
    IApplicationRecord,
    Error,
    { id: string; body: IUpdateApplicationRequest }
  >({
    mutationFn: ({ id, body }) =>
      fetchJson<IApplicationRecord>(`/api/applications/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["applications"] }),
  });
}

export function useGenerateCoverLetter(id: string) {
  const { toast } = useToast();

  const [coverLetter, setCoverLetter] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);

  const generate = async () => {
    setIsGenerating(true);
    setCoverLetter("");

    try {
      const res = await fetch(`/api/applications/${id}/cover-letter`);
      if (!res.ok || !res.body) {
        toast.error("Failed to generate cover letter");
        return;
      }

      const reader = res.body.getReader();
      const decoder = new TextDecoder();

      while (true) {
        const { done, value } = await reader.read();
        if (done) {
          break;
        }
        setCoverLetter((prev: string) => prev + decoder.decode(value));
      }
    } catch {
      toast.error("Failed to generate cover letter");
    } finally {
      setIsGenerating(false);
    }
  };

  return { coverLetter, setCoverLetter, isGenerating, generate };
}
