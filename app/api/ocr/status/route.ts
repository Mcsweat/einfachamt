import { NextResponse } from "next/server";
import { isGoogleDocumentAiConfigured } from "@/lib/google-document-ai";
import { getOcrAccess } from "@/lib/ocr-access";

export function GET() {
  const provider = process.env.OCR_PROVIDER?.trim() ?? "mock";
  const googleConfigured = isGoogleDocumentAiConfigured();
  const ocrAccess = getOcrAccess();
  const googleAvailable =
    provider === "google" &&
    googleConfigured &&
    ocrAccess.allowGoogleDocumentAi;

  return NextResponse.json({
    ok: true,
    provider,
    googleConfigured,
    googlePaywallEnabled: ocrAccess.googlePaywallEnabled,
    googlePaywalled:
      provider === "google" &&
      googleConfigured &&
      !ocrAccess.allowGoogleDocumentAi,
    paidOcrOverride: ocrAccess.paidOcrOverride,
    googleEnabled: googleAvailable,
    tesseractEnabled: provider === "tesseract",
    supportedTypes:
      provider === "google"
        ? ["application/pdf", "image/jpeg", "image/png"]
        : ["image/jpeg", "image/png"],
    pdfSupport: provider === "google" ? "yes" : "not_yet",
  });
}
