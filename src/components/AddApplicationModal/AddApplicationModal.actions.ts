"use server";

import { revalidatePath } from "next/cache";
import { authenticateUser } from "@/lib/auth";
import type { ApplicationForm } from "@/lib/applications/applications.types";

export async function createApplication(
  values: ApplicationForm,
  coverLetter: string,
): Promise<void> {
  const { user, supabase } = await authenticateUser();

  if (!user) {
    throw new Error("Unauthorized");
  }

  const { data: application, error } = await supabase
    .from("applications")
    .insert({
      companyName: values.companyName,
      appliedRole: values.appliedRole,
      location: values.location || undefined,
      jobType: values.jobType || undefined,
      dateApplied: values.dateApplied || undefined,
      source: values.source || undefined,
      salaryRange: values.salaryRange || undefined,
      status: values.status || undefined,
      userId: user.id,
    })
    .select()
    .single();

  if (error) {
    throw new Error(error.message);
  }

  await supabase.from("application_details").insert({
    applicationId: application.id,
    contactName: values.contactName || undefined,
    jobPostingUrl: values.jobPostingUrl || undefined,
    pros: values.pros || undefined,
    cons: values.cons || undefined,
    rejectionReason: values.rejectionReason || undefined,
    coverLetter: coverLetter || undefined,
  });

  revalidatePath("/");
}
