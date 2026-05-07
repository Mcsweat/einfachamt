export type OcrAccess = {
  googlePaywallEnabled: boolean;
  paidOcrOverride: boolean;
  hasActiveSubscription: boolean;
  allowGoogleDocumentAi: boolean;
};

function isEnabled(value: string | undefined) {
  return value?.trim().toLowerCase() === "true";
}

export function getOcrAccess({
  hasActiveSubscription = false,
}: {
  hasActiveSubscription?: boolean;
} = {}): OcrAccess {
  const googlePaywallEnabled =
    process.env.GOOGLE_DOCUMENT_AI_PAYWALL?.trim().toLowerCase() !== "off";
  const paidOcrOverride = isEnabled(process.env.EINFACHAMT_PAID_OCR_OVERRIDE);

  return {
    googlePaywallEnabled,
    paidOcrOverride,
    hasActiveSubscription,
    allowGoogleDocumentAi:
      !googlePaywallEnabled || paidOcrOverride || hasActiveSubscription,
  };
}
