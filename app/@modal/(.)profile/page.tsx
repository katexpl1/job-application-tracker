"use client";

export const dynamic = "force-dynamic";

import { ProfileContent } from "@/app/profile/ProfileContent";
import { Modal } from "blunt-ui";
import { useRouter } from "next/navigation";

export default function ProfileModal() {
  const router = useRouter();

  return (
    <Modal open onClose={() => router.back()} size="lg" title="My profile">
      <ProfileContent />
    </Modal>
  );
}
