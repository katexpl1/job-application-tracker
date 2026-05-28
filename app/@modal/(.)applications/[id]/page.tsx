"use client";

import { ApplicationDetailsContent } from "@/app/components/ApplicationDetailsContent";
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
      size="md"
      title="Application details"
    >
      <ApplicationDetailsContent id={id} />
    </Modal>
  );
}
