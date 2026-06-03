import { errorResponse, HttpStatus } from "@/app/api/utils";
import { authenticateUser } from "@/app/lib/auth";
import { buildCoverLetterPrompt } from "@/app/api/applications/[id]/cover-letter/CoverLetter.helpers";
import Anthropic from "@anthropic-ai/sdk";
import type { NextRequest } from "next/server";
import type { IApplication, IApplicationDetails } from "@/app/lib/models";

const client = new Anthropic();

export async function POST(req: NextRequest) {
  const { user, supabase } = await authenticateUser();
  if (!user) {
    return errorResponse("Unauthorized", HttpStatus.Unauthorized);
  }

  const body = await req.json();

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
        content: buildCoverLetterPrompt(
          body as IApplication,
          body as IApplicationDetails,
          profile ?? undefined,
        ),
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
