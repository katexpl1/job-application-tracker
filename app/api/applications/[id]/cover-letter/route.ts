import { errorResponse, HttpStatus } from "@/app/api/utils";
import { authenticateUser } from "@/app/lib/auth";
import { buildCoverLetterPrompt } from "./CoverLetter.helpers";
import Anthropic from "@anthropic-ai/sdk";
import type { NextRequest } from "next/server";

const client = new Anthropic();

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { user, supabase } = await authenticateUser();
  if (!user) {
    return errorResponse("Unauthorized", HttpStatus.Unauthorized);
  }

  const { id } = await params;

  const { data: application, error } = await supabase
    .from("applications")
    .select("*")
    .eq("id", id)
    .eq("userId", user.id)
    .single();

  if (error) {
    return errorResponse("Application not found", HttpStatus.NotFound);
  }

  const { data: details } = await supabase
    .from("application_details")
    .select("*")
    .eq("applicationId", id)
    .maybeSingle();

  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("userId", user.id)
    .maybeSingle();

  const anthropicStream = client.messages.stream({
    model: "claude-haiku-4-5",
    max_tokens: 1024,
    messages: [
      {
        role: "user",
        content: buildCoverLetterPrompt(application, details ?? undefined, profile ?? undefined),
      },
    ],
  });

  const encoder = new TextEncoder();
  const readableStream = new ReadableStream({
    async start(controller) {
      try {
        anthropicStream.on("text", (text) => {
          controller.enqueue(encoder.encode(text));
        });
        await anthropicStream.finalMessage();
      } catch {
        controller.error(new Error("Stream failed"));
      } finally {
        controller.close();
      }
    },
  });

  return new Response(readableStream, {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
}
