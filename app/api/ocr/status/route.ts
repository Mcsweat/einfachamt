import { NextResponse } from "next/server";
import { isGoogleDocumentAiConfigured } from "@/lib/google-document-ai";
import { getOcrAccess } from "@/lib/ocr-access";
import { getCurrentUserSubscription } from "@/lib/subscription";

export async function GET() {
  const provider = process.env.OCR_PROVIDER?.trim() ?? "mock";
  const googleConfigured = isGoogleDocumentAiConfigured();
  const subscription = await getCurrentUserSubscription();
  const ocrAccess = getOcrAccess({
    hasActiveSubscription: subscription.isPaid,
  });
  const googleAvailable =
    provider === "google" &&
    googleConfigured &&
    ocrAccess.allowGoogleDocumentAi;

  return NextResponse.json({
    ok: true,
    provider,
    googleConfigured,
    googlePaywallEnabled: ocrAccess.googlePaywallEnabled,
    subscriptionStatus: subscription.status,
    hasActiveSubscription: ocrAccess.hasActiveSubscription,
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
