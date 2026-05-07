import { createWorker } from "tesseract.js";
import { extractTextWithAzure, isAzureOcrConfigured } from "@/lib/azure-ocr";

export type OcrResult = {
  provider: "azure" | "tesseract" | "mock";
  text: string;
  note?: string;
};

const mockText =
  "Mock OCR: Das Jobcenter möchte Unterlagen. Bitte rechtzeitig antworten.";

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

export async function extractTextWithOcr(
  file: Blob,
  fileType: string,
): Promise<OcrResult> {
  if (process.env.OCR_PROVIDER === "azure") {
    const text = await extractTextWithAzure(file, fileType);

    if (text) {
      return {
        provider: "azure",
        text,
      };
    }

    return {
      provider: "mock",
      text: mockText,
      note:
        "OCR_PROVIDER ist auf azure gesetzt, aber Azure ist nicht konfiguriert.",
    };
  }

  if (process.env.OCR_PROVIDER === "auto" && isAzureOcrConfigured()) {
    const text = await extractTextWithAzure(file, fileType);

    if (!text) {
      return {
        provider: "mock",
        text: mockText,
        note: "Azure ist konfiguriert, hat aber keinen Text zurückgegeben.",
      };
    }

    return {
      provider: "azure",
      text,
    };
  }

  if (process.env.OCR_PROVIDER !== "tesseract") {
    return {
      provider: "mock",
      text: mockText,
      note: "OCR_PROVIDER ist nicht auf tesseract gesetzt.",
    };
  }

  if (!supportsTesseract(fileType)) {
    return {
      provider: "mock",
      text: mockText,
      note: "Tesseract MVP unterstützt aktuell JPG und PNG. PDF folgt später.",
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
