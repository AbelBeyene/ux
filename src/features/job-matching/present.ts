import { scoreJobMatch } from "../../lib/jobMatch";
import type { JobListing } from "../../types/dashboard";
import type { RawJobListing } from "./types";

/** Best-effort source label from the apply link's domain — JSearch aggregates multiple boards without reliably attributing each listing. */
function inferSource(applyLink: string): string {
  if (applyLink.includes("linkedin.com")) return "LinkedIn";
  if (applyLink.includes("indeed.com")) return "Indeed";
  if (applyLink.includes("glassdoor.com")) return "Glassdoor";
  if (applyLink.includes("ziprecruiter.com")) return "ZipRecruiter";
  return "Job Search";
}

/** Scores each listing against the resume's own skills and sorts best-match first. */
export function presentJobs(jobs: RawJobListing[], skills: string[]): JobListing[] {
  return jobs
    .map((job): JobListing => {
      const { score, matchedSkills } = scoreJobMatch(`${job.title} ${job.description}`, skills);
      return {
        id: job.id,
        title: job.title,
        company: job.company,
        location: job.location,
        workMode: job.isRemote ? "Remote" : undefined,
        matchScore: score,
        matchedSkills,
        postedAgo: job.postedAgo,
        source: inferSource(job.applyLink),
        applyLink: job.applyLink || undefined,
      };
    })
    .sort((a, b) => b.matchScore - a.matchScore);
}
