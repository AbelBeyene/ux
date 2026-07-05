import type { VercelRequest, VercelResponse } from "@vercel/node";
import { withHandler, requireStringField } from "./_lib/http";
import { analyzeResumeCritique } from "./_lib/critique";

const MAX_RESUME_INPUT_CHARS = 20_000;

export default withHandler("POST", async (req: VercelRequest, res: VercelResponse) => {
  const resumeText = requireStringField(req.body, "resumeText", MAX_RESUME_INPUT_CHARS);
  const result = await analyzeResumeCritique(resumeText);
  res.status(200).json(result);
});
