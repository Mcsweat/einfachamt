export type OcrAccess = {
  googlePaywallEnabled: boolean;
  paidOcrOverride: boolean;
  allowGoogleDocumentAi: boolean;
};

function isEnabled(value: string | undefined) {
  return value?.trim().toLowerCase() === "true";
}

export function getOcrAccess(): OcrAccess {
  const googlePaywallEnabled =
    process.env.GOOGLE_DOCUMENT_AI_PAYWALL?.trim().toLowerCase() !== "off";
  const paidOcrOverride = isEnabled(process.env.EINFACHAMT_PAID_OCR_OVERRIDE);

  return {
    googlePaywallEnabled,
    paidOcrOverride,
    allowGoogleDocumentAi: !googlePaywallEnabled || paidOcrOverride,
  };
}
