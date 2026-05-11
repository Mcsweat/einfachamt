/**
 * Email service using Resend.
 * Requires RESEND_API_KEY in environment variables.
 * Sign up free at resend.com (3 000 emails/month free).
 */

type Language = "de" | "en";

interface AnalysisEmailParams {
  to: string;
  language: Language;
  documentId: string;
  summary: string;
  deadline?: string;
}

function buildHtml(params: AnalysisEmailParams): string {
  const { language, documentId, summary, deadline } = params;
  const isDe = language === "de";
  const analysisUrl = `https://einfachamt.com/analysis/${documentId}`;

  const deadlineHtml =
    deadline && deadline !== "Keine klare Frist erkannt"
      ? `<div style="background:#fffbeb;border-radius:12px;padding:16px 20px;margin:16px 0;">
          <p style="margin:0;font-size:13px;font-weight:700;color:#92400e;text-transform:uppercase;letter-spacing:0.05em;">
            ${isDe ? "⏰ Wichtige Frist" : "⏰ Important deadline"}
          </p>
          <p style="margin:8px 0 0;font-size:17px;font-weight:700;color:#78350f;">${deadline}</p>
        </div>`
      : "";

  return `<!DOCTYPE html>
<html lang="${isDe ? "de" : "en"}">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#f2f2f7;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;">
  <div style="max-width:480px;margin:0 auto;padding:24px 16px;">

    <!-- Header -->
    <div style="background:#0a84ff;border-radius:20px;padding:24px;text-align:center;margin-bottom:16px;">
      <p style="margin:0;color:white;font-size:28px;font-weight:900;">EinfachAmt</p>
      <p style="margin:8px 0 0;color:rgba(255,255,255,0.85);font-size:15px;">
        ${isDe ? "Dein Brief wurde ausgelesen ✓" : "Your letter has been read ✓"}
      </p>
    </div>

    <!-- Main card -->
    <div style="background:white;border-radius:20px;padding:24px;margin-bottom:16px;">
      <p style="margin:0;font-size:13px;font-weight:700;color:#0a84ff;text-transform:uppercase;letter-spacing:0.05em;">
        ${isDe ? "Kurz zusammengefasst" : "In short"}
      </p>
      <p style="margin:10px 0 0;font-size:17px;font-weight:700;color:#111827;line-height:1.5;">
        ${summary}
      </p>
      ${deadlineHtml}
    </div>

    <!-- CTA -->
    <a href="${analysisUrl}"
       style="display:block;background:#0a84ff;border-radius:999px;padding:16px;text-align:center;color:white;font-size:17px;font-weight:700;text-decoration:none;margin-bottom:16px;">
      ${isDe ? "Vollständige Erklärung ansehen →" : "View full explanation →"}
    </a>

    <!-- Footer -->
    <p style="margin:0;text-align:center;font-size:12px;color:#9ca3af;line-height:1.6;">
      ${isDe
        ? "EinfachAmt ist kein offizieller Behördendienst und bietet keine Rechtsberatung."
        : "EinfachAmt is not an official government service and does not provide legal advice."}
      <br>
      <a href="https://einfachamt.com/privacy" style="color:#9ca3af;">${isDe ? "Datenschutz" : "Privacy"}</a>
      &nbsp;·&nbsp;
      <a href="https://einfachamt.com/kontakt" style="color:#9ca3af;">${isDe ? "Kontakt" : "Contact"}</a>
    </p>
  </div>
</body>
</html>`;
}

export async function sendAnalysisEmail(
  params: AnalysisEmailParams,
): Promise<void> {
  if (!process.env.RESEND_API_KEY) {
    // No key configured — silently skip. App works without email.
    return;
  }

  const { Resend } = await import("resend");
  const resend = new Resend(process.env.RESEND_API_KEY);

  const isDe = params.language === "de";

  await resend.emails.send({
    from: "EinfachAmt <noreply@einfachamt.com>",
    to: params.to,
    subject: isDe
      ? "Dein Brief wurde ausgelesen ✓"
      : "Your letter has been read ✓",
    html: buildHtml(params),
  });
}
