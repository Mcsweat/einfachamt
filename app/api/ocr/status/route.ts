import { NextResponse } from "next/server";
import { isAzureOcrConfigured } from "@/lib/azure-ocr";

export function GET() {
  const provider = process.env.OCR_PROVIDER?.trim() ?? "mock";

  return NextResponse.json({
    ok: true,
    provider,
    azureConfigured: isAzureOcrConfigured(),
    azureEnabled: provider === "azure" && isAzureOcrConfigured(),
    tesseractEnabled: provider === "tesseract",
    supportedTypes:
      provider === "azure"
        ? ["application/pdf", "image/jpeg", "image/png"]
        : ["image/jpeg", "image/png"],
    pdfSupport: provider === "azure" ? "yes" : "not_yet",
  });
}
