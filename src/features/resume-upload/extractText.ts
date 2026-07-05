import { GlobalWorkerOptions, getDocument } from "pdfjs-dist";
import mammoth from "mammoth";

GlobalWorkerOptions.workerSrc = new URL(
  "pdfjs-dist/build/pdf.worker.min.mjs",
  import.meta.url,
).toString();

async function extractFromPdf(file: File): Promise<string> {
  const buffer = await file.arrayBuffer();
  const doc = await getDocument({ data: buffer }).promise;
  const pages: string[] = [];
  for (let i = 1; i <= doc.numPages; i++) {
    const page = await doc.getPage(i);
    const content = await page.getTextContent();
    pages.push(content.items.map((item) => ("str" in item ? item.str : "")).join(" "));
  }
  return pages.join("\n\n");
}

async function extractFromDocx(file: File): Promise<string> {
  const buffer = await file.arrayBuffer();
  const { value } = await mammoth.extractRawText({ arrayBuffer: buffer });
  return value;
}

/** Extracts plain text from an uploaded resume file (.pdf, .docx, .txt), entirely client-side. */
export async function extractTextFromFile(file: File): Promise<string> {
  const name = file.name.toLowerCase();
  if (name.endsWith(".pdf")) return extractFromPdf(file);
  if (name.endsWith(".docx")) return extractFromDocx(file);
  if (name.endsWith(".txt")) return file.text();
  throw new Error("Unsupported file type — upload a .pdf, .docx, or .txt file.");
}
