import { NextResponse } from "next/server";
import { isGoogleDocumentAiConfigured } from "@/lib/google-document-ai";

export function GET() {
  const provider = process.env.OCR_PROVIDER?.trim() ?? "mock";
  const googleConfigured = isGoogleDocumentAiConfigured();

  return NextResponse.json({
    ok: true,
    provider,
    googleConfigured,
    googleEnabled: provider === "google" && googleConfigured,
    tesseractEnabled: provider === "tesseract",
    supportedTypes:
      provider === "google"
        ? ["application/pdf", "image/jpeg", "image/png"]
        : ["image/jpeg", "image/png"],
    pdfSupport: provider === "google" ? "yes" : "not_yet",
  });
}
