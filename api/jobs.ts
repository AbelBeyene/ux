import type { VercelRequest, VercelResponse } from "@vercel/node";
import { withHandler, queryParam } from "./_lib/http";
import { searchJobs, type JobSearchParams } from "./_lib/jobSearch";

const VALID_DATE_POSTED = new Set(["all", "today", "3days", "week", "month"]);
const VALID_EMPLOYMENT_TYPE = new Set(["all", "FULLTIME", "PARTTIME", "CONTRACTOR", "INTERN"]);

function parseParams(req: VercelRequest): JobSearchParams {
  const role = queryParam(req.query, "role") || "software developer";
  const location = queryParam(req.query, "location") || "";
  const keyword = queryParam(req.query, "keyword") || "";
  const query = [keyword, role, location && `jobs in ${location}`].filter(Boolean).join(" ");

  const datePosted = queryParam(req.query, "datePosted") || "week";
  const employmentType = queryParam(req.query, "employmentType") || "all";

  return {
    query,
    country: queryParam(req.query, "country") || "us",
    datePosted: VALID_DATE_POSTED.has(datePosted) ? (datePosted as JobSearchParams["datePosted"]) : "week",
    employmentType: VALID_EMPLOYMENT_TYPE.has(employmentType)
      ? (employmentType as JobSearchParams["employmentType"])
      : "all",
    remoteOnly: queryParam(req.query, "remoteOnly") === "true",
  };
}

export default withHandler("GET", async (req: VercelRequest, res: VercelResponse) => {
  const jobs = await searchJobs(parseParams(req));
  res.status(200).json({ jobs });
});
