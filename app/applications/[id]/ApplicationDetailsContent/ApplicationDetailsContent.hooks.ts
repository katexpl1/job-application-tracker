import { useState } from "react";
import { useToast } from "blunt-ui";

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
