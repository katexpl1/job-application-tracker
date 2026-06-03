import { createClient } from "@supabase/supabase-js";
import { readFileSync } from "fs";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));

// Load .env manually
const envPath = resolve(__dirname, "../.env");
const envVars = Object.fromEntries(
  readFileSync(envPath, "utf-8")
    .split("\n")
    .filter((l) => l.includes("=") && !l.startsWith("#"))
    .map((l) => {
      const idx = l.indexOf("=");
      const val = l.slice(idx + 1).trim().replace(/^["']|["']$/g, "");
      return [l.slice(0, idx).trim(), val];
    }),
);

const SUPABASE_URL = envVars.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_ANON_KEY = envVars.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const DEMO_EMAIL = envVars.NEXT_PUBLIC_DEMO_EMAIL;
const DEMO_PASSWORD = envVars.NEXT_PUBLIC_DEMO_PASSWORD;

if (!SUPABASE_URL || !SUPABASE_ANON_KEY || !DEMO_EMAIL || !DEMO_PASSWORD) {
  console.error("Missing required env vars. Check your .env file.");
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

const mockApplications = [
  {
    companyName: "Stripe",
    appliedRole: "Senior Frontend Engineer",
    location: "San Francisco, CA",
    jobType: "hybrid",
    dateApplied: "2025-04-02",
    source: "linkedin",
    salaryRange: "$150k – $190k",
    status: "Interview",
  },
  {
    companyName: "Vercel",
    appliedRole: "Staff Software Engineer",
    location: "Remote",
    jobType: "remote",
    dateApplied: "2025-04-10",
    source: "company-site",
    salaryRange: "$160k – $200k",
    status: "In review",
  },
  {
    companyName: "Linear",
    appliedRole: "Frontend Engineer",
    location: "Remote",
    jobType: "remote",
    dateApplied: "2025-04-15",
    source: "referral",
    salaryRange: "$130k – $160k",
    status: "Applied",
  },
  {
    companyName: "Notion",
    appliedRole: "Software Engineer II",
    location: "New York, NY",
    jobType: "hybrid",
    dateApplied: "2025-03-20",
    source: "linkedin",
    salaryRange: "$140k – $175k",
    status: "Rejected",
  },
  {
    companyName: "Figma",
    appliedRole: "Senior Software Engineer",
    location: "San Francisco, CA",
    jobType: "on-site",
    dateApplied: "2025-03-05",
    source: "referral",
    salaryRange: "$155k – $195k",
    status: "Offer",
  },
  {
    companyName: "Loom",
    appliedRole: "React Developer",
    location: "Remote",
    jobType: "remote",
    dateApplied: "2025-04-22",
    source: "linkedin",
    salaryRange: "$120k – $150k",
    status: "Applied",
  },
  {
    companyName: "GitHub",
    appliedRole: "Senior Frontend Engineer",
    location: "Remote",
    jobType: "remote",
    dateApplied: "2025-04-01",
    source: "company-site",
    salaryRange: "$145k – $185k",
    status: "In review",
  },
  {
    companyName: "Shopify",
    appliedRole: "Software Engineer, Platform",
    location: "Remote",
    jobType: "remote",
    dateApplied: "2025-03-28",
    source: "linkedin",
    salaryRange: "$130k – $165k",
    status: "Rejected",
  },
  {
    companyName: "Datadog",
    appliedRole: "Frontend Engineer",
    location: "New York, NY",
    jobType: "hybrid",
    dateApplied: "2025-04-18",
    source: "other",
    salaryRange: "$135k – $170k",
    status: "Interview",
  },
  {
    companyName: "Retool",
    appliedRole: "Software Engineer",
    location: "San Francisco, CA",
    jobType: "on-site",
    dateApplied: "2025-04-25",
    source: "referral",
    salaryRange: "$125k – $155k",
    status: "Applied",
  },
  {
    companyName: "Atlassian",
    appliedRole: "Senior React Engineer",
    location: "Austin, TX",
    jobType: "hybrid",
    dateApplied: "2025-05-02",
    source: "linkedin",
    salaryRange: "$140k – $175k",
    status: "Applied",
  },
  {
    companyName: "Cloudflare",
    appliedRole: "Software Engineer, Edge",
    location: "Remote",
    jobType: "remote",
    dateApplied: "2025-05-05",
    source: "company-site",
    salaryRange: "$145k – $180k",
    status: "In review",
  },
  {
    companyName: "PlanetScale",
    appliedRole: "Frontend Engineer",
    location: "Remote",
    jobType: "remote",
    dateApplied: "2025-05-08",
    source: "referral",
    salaryRange: "$130k – $160k",
    status: "Interview",
  },
  {
    companyName: "Supabase",
    appliedRole: "Developer Experience Engineer",
    location: "Remote",
    jobType: "remote",
    dateApplied: "2025-05-10",
    source: "other",
    salaryRange: "$120k – $155k",
    status: "Applied",
  },
  {
    companyName: "Tailwind Labs",
    appliedRole: "Software Engineer",
    location: "Remote",
    jobType: "remote",
    dateApplied: "2025-05-12",
    source: "company-site",
    salaryRange: "$135k – $165k",
    status: "Rejected",
  },
];

async function seed() {
  console.log(`Signing in as ${DEMO_EMAIL}...`);
  const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
    email: DEMO_EMAIL,
    password: DEMO_PASSWORD,
  });

  if (authError || !authData.user) {
    console.error("Authentication failed:", authError?.message);
    process.exit(1);
  }

  const userId = authData.user.id;
  console.log(`Signed in. User ID: ${userId}`);

  console.log("Removing existing applications...");
  const { error: deleteError } = await supabase
    .from("applications")
    .delete()
    .eq("userId", userId);

  if (deleteError) {
    console.error("Delete failed:", deleteError.message);
    process.exit(1);
  }

  console.log("Inserting mock applications...");
  const rows = mockApplications.map((a) => ({ ...a, userId }));
  const { data: inserted, error: insertError } = await supabase
    .from("applications")
    .insert(rows)
    .select();

  if (insertError) {
    console.error("Insert failed:", insertError.message);
    process.exit(1);
  }

  console.log(`Done! Inserted ${inserted.length} applications.`);
}

seed();
