import { IApplication, IApplicationDetails, IProfile } from "@/app/lib/models";

export function buildCoverLetterPrompt(
  application: IApplication,
  details?: IApplicationDetails,
  profile?: IProfile,
): string {
  return `Write a professional cover letter for the following job application.

  ${profile?.firstName || profile?.lastName ? `Applicant: ${[profile.firstName, profile.lastName].filter(Boolean).join(" ")}` : ""}
  ${profile?.title ? `Current title: ${profile.title}` : ""}
  ${profile?.yearsOfExperience ? `Years of experience: ${profile.yearsOfExperience}` : ""}
  ${profile?.skills ? `Skills: ${profile.skills}` : ""}
  ${profile?.bio ? `About: ${profile.bio}` : ""}

  Company: ${application.companyName}
  Role: ${application.appliedRole}
  Location: ${application.location || "not specified"}
  Contact name: ${details?.contactName || "not specified"}
  Job type: ${application.jobType || "not specified"}
  ${details?.jobPostingUrl ? `Job posting: ${details.jobPostingUrl}` : ""}
  ${details?.notes ? `Additional notes: ${details.notes}` : ""}
  ${details?.pros ? `What appeals to me about this role: ${details.pros}` : ""}

  Write a compelling, professional cover letter in first person. It should:
  - Open with a strong hook
  - Highlight relevant experience and enthusiasm for the role using the applicant's background above
  - Reference specific details about the company and position
  - Close with a clear call to action
  - Be 3-4 paragraphs, professional but not stiff

  Return only the cover letter text, no subject line or extra commentary.`;
}
