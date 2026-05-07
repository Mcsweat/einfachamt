import { NextResponse } from "next/server";

export function GET() {
  return NextResponse.json({
    ok: true,
    provider: process.env.OCR_PROVIDER ?? "mock",
    tesseractEnabled: process.env.OCR_PROVIDER === "tesseract",
    supportedTypes: ["image/jpeg", "image/png"],
    pdfSupport: "not_yet",
  });
}
