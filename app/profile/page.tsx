"use client";

import Link from "next/link";
import { ProfileContent } from "./ProfileContent";

export default function ProfilePage() {
  return (
    <>
      <Link href="/" style={{ display: "block", padding: "16px", fontSize: "0.875rem" }}>
        ← Back
      </Link>
      <ProfileContent />
    </>
  );
}
