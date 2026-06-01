"use client";

import dynamic from "next/dynamic";
import { useRouter } from "next/navigation";

const Modal = dynamic(
  () => import("blunt-ui").then((mod) => mod.Modal),
  { ssr: false },
);

const ProfileContent = dynamic(
  () => import("@/app/profile/ProfileContent").then((mod) => mod.ProfileContent),
  { ssr: false },
);

export default function ProfileModal() {
  const router = useRouter();

  return (
    <Modal open onClose={() => router.back()} size="lg" title="My profile">
      <ProfileContent />
    </Modal>
  );
}
