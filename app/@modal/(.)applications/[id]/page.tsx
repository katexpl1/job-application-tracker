"use client";

import { ApplicationDetailsContent } from "@/app/applications/[id]/ApplicationDetailsContent";
import { Modal } from "blunt-ui";
import { useRouter } from "next/navigation";
import { use } from "react";

export default function ApplicationModal({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const router = useRouter();

  return (
    <Modal
      open
      onClose={() => router.back()}
      size="lg"
      title="Application details"
    >
      <ApplicationDetailsContent id={id} />
    </Modal>
  );
}
