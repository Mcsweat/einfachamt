import { createWorker } from "tesseract.js";

export type OcrResult = {
  provider: "tesseract" | "mock";
  text: string;
  note?: string;
};

const mockText =
  "Mock OCR: Das Jobcenter möchte Unterlagen. Bitte rechtzeitig antworten.";

function supportsTesseract(fileType: string) {
  return fileType === "image/jpeg" || fileType === "image/png";
}

export async function extractTextWithOcr(
  file: Blob,
  fileType: string,
): Promise<OcrResult> {
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

  const worker = await createWorker("deu+eng");

  try {
    const buffer = Buffer.from(await file.arrayBuffer());
    const result = await worker.recognize(buffer);
    const text = result.data.text.trim();

    if (!text) {
      return {
        provider: "mock",
        text: mockText,
        note: "Tesseract hat keinen Text erkannt.",
      };
    }

    return {
      provider: "tesseract",
      text,
    };
  } finally {
    await worker.terminate();
  }
}
