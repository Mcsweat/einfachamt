import { createWorker } from "tesseract.js";
import {
  extractTextWithGoogleDocumentAi,
  isGoogleDocumentAiConfigured,
} from "@/lib/google-document-ai";

export type OcrResult = {
  provider: "google" | "tesseract" | "mock";
  text: string;
  note?: string;
};

type OcrOptions = {
  allowGoogleDocumentAi?: boolean;
};

const mockText =
  "Mock OCR: Das Jobcenter moechte Unterlagen. Bitte rechtzeitig antworten.";

function supportsTesseract(fileType: string) {
  return fileType === "image/jpeg" || fileType === "image/png";
}

async function recognizeWithLanguage(file: Blob, language: string) {
  const worker = await createWorker(language);

  try {
    const buffer = Buffer.from(await file.arrayBuffer());
    const result = await worker.recognize(buffer);
    return result.data.text.trim();
  } finally {
    await worker.terminate();
  }
}

async function readWithGoogle(file: Blob, fileType: string): Promise<OcrResult> {
  const text = await extractTextWithGoogleDocumentAi(file, fileType);

  if (text) {
    return {
      provider: "google",
      text,
    };
  }

  return {
    provider: "mock",
    text: mockText,
    note:
      "Google Document AI ist nicht vollstaendig konfiguriert oder hat keinen Text erkannt.",
  };
}

export async function extractTextWithOcr(
  file: Blob,
  fileType: string,
  options: OcrOptions = {},
): Promise<OcrResult> {
  const provider = process.env.OCR_PROVIDER?.trim() ?? "mock";

  if (
    (provider === "google" ||
      (provider === "auto" && isGoogleDocumentAiConfigured())) &&
    !options.allowGoogleDocumentAi
  ) {
    return {
      provider: "mock",
      text: mockText,
      note:
        "Google Document AI ist fuer den Plus-Plan reserviert. Aktuell nutzt EinfachAmt die einfache Analyse.",
    };
  }

  if (provider === "google") {
    return readWithGoogle(file, fileType);
  }

  if (provider === "auto" && isGoogleDocumentAiConfigured()) {
    return readWithGoogle(file, fileType);
  }

  if (provider !== "tesseract") {
    return {
      provider: "mock",
      text: mockText,
      note: "OCR_PROVIDER ist nicht auf google oder tesseract gesetzt.",
    };
  }

  if (!supportsTesseract(fileType)) {
    return {
      provider: "mock",
      text: mockText,
      note: "Tesseract MVP unterstuetzt aktuell JPG und PNG. PDF folgt spaeter.",
    };
  }

  let text = "";

  try {
    text = await recognizeWithLanguage(file, "deu+eng");
  } catch {
    text = await recognizeWithLanguage(file, "eng");
  }

  if (text) {
    return {
      provider: "tesseract",
      text,
    };
  }

  return {
    provider: "mock",
    text: mockText,
    note: "Tesseract hat keinen Text erkannt.",
  };
}
