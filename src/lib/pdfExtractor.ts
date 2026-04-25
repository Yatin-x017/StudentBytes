import * as pdfjsLib from 'pdfjs-dist';

// Point worker to CDN — required for pdfjs to work in browser
// Note: In production, ensure this version matches your installed pdfjs-dist version
const PDFJS_VERSION = '5.6.205';
pdfjsLib.GlobalWorkerOptions.workerSrc =
  `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${PDFJS_VERSION}/pdf.worker.min.mjs`;

export interface ExtractedFile {
  name: string;
  text: string;
  pageCount: number;
  sizeKb: number;
}

export async function extractTextFromPDF(file: File): Promise<ExtractedFile> {
  const arrayBuffer = await file.arrayBuffer();
  const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;

  let fullText = '';
  for (let i = 1; i <= pdf.numPages; i++) {
    const page = await pdf.getPage(i);
    const content = await page.getTextContent();
    const pageText = content.items
      .map((item: any) => item.str)
      .join(' ');
    fullText += `\n--- Page ${i} ---\n${pageText}`;
  }

  return {
    name: file.name,
    text: fullText.trim(),
    pageCount: pdf.numPages,
    sizeKb: Math.round(file.size / 1024),
  };
}

export async function extractTextFromTxt(file: File): Promise<ExtractedFile> {
  const text = await file.text();
  return {
    name: file.name,
    text,
    pageCount: 1,
    sizeKb: Math.round(file.size / 1024),
  };
}

export async function processFile(file: File): Promise<ExtractedFile> {
  if (file.type === 'application/pdf' || file.name.endsWith('.pdf')) {
    return extractTextFromPDF(file);
  }
  if (file.type === 'text/plain' || file.name.endsWith('.txt') ||
      file.name.endsWith('.md')) {
    return extractTextFromTxt(file);
  }
  throw new Error(`Unsupported file type: ${file.type || file.name}`);
}

// Truncate to fit in context window (max ~8000 chars to leave room for conversation)
export function truncateForContext(text: string, maxChars = 8000): string {
  if (text.length <= maxChars) return text;
  return text.slice(0, maxChars) +
    `\n\n[Document truncated — showing first ${maxChars} characters of ${text.length} total]`;
}
