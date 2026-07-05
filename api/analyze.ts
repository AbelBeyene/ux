import type { VercelRequest, VercelResponse } from "@vercel/node";
import { withHandler, requireStringField } from "./_lib/http";
import { analyzeAts } from "./_lib/atsAnalysis";

const MAX_RESUME_INPUT_CHARS = 20_000;
const MAX_ROLE_INPUT_CHARS = 200;

export default withHandler("POST", async (req: VercelRequest, res: VercelResponse) => {
  const resumeText = requireStringField(req.body, "resumeText", MAX_RESUME_INPUT_CHARS);
  const targetRole = requireStringField(req.body, "targetRole", MAX_ROLE_INPUT_CHARS);
  const result = await analyzeAts(resumeText, targetRole);
  res.status(200).json(result);
});
