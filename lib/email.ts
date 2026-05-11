/**
 * Email service using Resend.
 * Requires RESEND_API_KEY in environment variables.
 * Sign up free at resend.com (3 000 emails/month free).
 */

type Language = "de" | "en";

// ── Shared send helper ────────────────────────────────────────────────────

async function send({ to, subject, html }: { to: string; subject: string; html: string }) {
  if (!process.env.RESEND_API_KEY) return; // silently skip when not configured
  const { Resend } = await import("resend");
  const resend = new Resend(process.env.RESEND_API_KEY);
  await resend.emails.send({ from: "EinfachAmt <noreply@einfachamt.com>", to, subject, html });
}

// ── Subscription confirmation email ──────────────────────────────────────

export async function sendSubscriptionConfirmationEmail({
  to,
  language,
  plan,
}: {
  to: string;
  language: Language;
  plan: "plus" | "antrag";
}): Promise<void> {
  const isDe = language === "de";

  const planName = plan === "antrag"
    ? (isDe ? "Antragsservice (39,99 €/Monat)" : "Application Service (€39.99/month)")
    : (isDe ? "Plus (9 €/Monat)" : "Plus (€9/month)");

  const planDetail = plan === "antrag"
    ? (isDe
        ? "Du kannst jetzt das offizielle Bürgergeld-Formular automatisch ausfüllen und als PDF herunterladen."
        : "You can now auto-fill the official Bürgergeld form and download it as a PDF.")
    : (isDe
        ? "Du kannst jetzt bis zu 50 Briefe pro Monat hochladen, PDFs analysieren und alle Analysen speichern."
        : "You can now upload up to 50 letters per month, analyse PDFs and save all analyses.");

  const ctaHref = plan === "antrag" ? "https://einfachamt.com/antrag" : "https://einfachamt.com/upload";
  const ctaLabel = plan === "antrag"
    ? (isDe ? "Antrag jetzt ausfüllen →" : "Fill application now →")
    : (isDe ? "Brief hochladen →" : "Upload letter →");

  const html = `<!DOCTYPE html>
<html lang="${isDe ? "de" : "en"}">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#f2f2f7;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;">
  <div style="max-width:480px;margin:0 auto;padding:24px 16px;">
    <div style="background:#0a84ff;border-radius:20px;padding:24px;text-align:center;margin-bottom:16px;">
      <p style="margin:0;color:white;font-size:28px;font-weight:900;">EinfachAmt</p>
      <p style="margin:8px 0 0;color:rgba(255,255,255,0.85);font-size:15px;">
        ${isDe ? "Abo aktiviert ✓" : "Subscription activated ✓"}
      </p>
    </div>
    <div style="background:white;border-radius:20px;padding:24px;margin-bottom:16px;">
      <p style="margin:0;font-size:13px;font-weight:700;color:#0a84ff;text-transform:uppercase;letter-spacing:0.05em;">
        ${isDe ? "Dein Plan" : "Your plan"}
      </p>
      <p style="margin:10px 0 0;font-size:22px;font-weight:900;color:#111827;">${planName}</p>
      <p style="margin:10px 0 0;font-size:15px;color:#4b5563;line-height:1.6;">${planDetail}</p>
      <div style="background:#f0f9ff;border-radius:12px;padding:14px 16px;margin-top:16px;">
        <p style="margin:0;font-size:13px;color:#0369a1;">
          ${isDe
            ? "💳 Abonnement jederzeit kündbar — Konto → Abo verwalten"
            : "💳 Cancel anytime — Account → Manage subscription"}
        </p>
      </div>
    </div>
    <a href="${ctaHref}" style="display:block;background:#0a84ff;border-radius:999px;padding:16px;text-align:center;color:white;font-size:17px;font-weight:700;text-decoration:none;margin-bottom:16px;">
      ${ctaLabel}
    </a>
    <p style="margin:0;text-align:center;font-size:12px;color:#9ca3af;line-height:1.6;">
      ${isDe ? "EinfachAmt · kein offizieller Behördendienst · keine Rechtsberatung" : "EinfachAmt · not an official government service · no legal advice"}
      <br>
      <a href="https://einfachamt.com/account" style="color:#9ca3af;">${isDe ? "Abo verwalten" : "Manage subscription"}</a>
      &nbsp;·&nbsp;
      <a href="https://einfachamt.com/kontakt" style="color:#9ca3af;">${isDe ? "Kontakt" : "Contact"}</a>
    </p>
  </div>
</body>
</html>`;

  await send({
    to,
    subject: isDe ? `EinfachAmt ${planName} — Zugang aktiviert ✓` : `EinfachAmt ${planName} — Access activated ✓`,
    html,
  });
}

// ── Welcome email (sent on first letter analysis) ─────────────────────────

export async function sendWelcomeEmail({ to, language }: { to: string; language: Language }): Promise<void> {
  const isDe = language === "de";
  const html = `<!DOCTYPE html>
<html lang="${isDe ? "de" : "en"}">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#f2f2f7;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;">
  <div style="max-width:480px;margin:0 auto;padding:24px 16px;">
    <div style="background:#0a84ff;border-radius:20px;padding:24px;text-align:center;margin-bottom:16px;">
      <p style="margin:0;color:white;font-size:28px;font-weight:900;">EinfachAmt</p>
      <p style="margin:8px 0 0;color:rgba(255,255,255,0.85);font-size:15px;">
        ${isDe ? "Willkommen 👋" : "Welcome 👋"}
      </p>
    </div>
    <div style="background:white;border-radius:20px;padding:24px;margin-bottom:16px;">
      <p style="margin:0;font-size:17px;font-weight:700;color:#111827;">
        ${isDe ? "Dein Konto ist bereit." : "Your account is ready."}
      </p>
      <p style="margin:10px 0 0;font-size:15px;color:#4b5563;line-height:1.6;">
        ${isDe
          ? "Lade deinen nächsten Behördenbrief hoch — EinfachAmt erklärt ihn in einfacher Sprache und schreibt dir einen Antwortentwurf."
          : "Upload your next official letter — EinfachAmt explains it in plain language and drafts a reply for you."}
      </p>
      ${isDe ? `<ul style="margin:14px 0 0;padding-left:20px;font-size:14px;color:#6b7280;line-height:2;">
        <li>1 Brief kostenlos testen</li>
        <li>Kein Konto für den ersten Test nötig</li>
        <li>Plus ab 9 €/Monat für unbegrenzte Nutzung</li>
      </ul>` : `<ul style="margin:14px 0 0;padding-left:20px;font-size:14px;color:#6b7280;line-height:2;">
        <li>1 letter free to try</li>
        <li>No account needed for the first try</li>
        <li>Plus from €9/month for unlimited use</li>
      </ul>`}
    </div>
    <a href="https://einfachamt.com/upload" style="display:block;background:#0a84ff;border-radius:999px;padding:16px;text-align:center;color:white;font-size:17px;font-weight:700;text-decoration:none;margin-bottom:16px;">
      ${isDe ? "Brief jetzt hochladen →" : "Upload letter now →"}
    </a>
    <p style="margin:0;text-align:center;font-size:12px;color:#9ca3af;">
      <a href="https://einfachamt.com/kontakt" style="color:#9ca3af;">${isDe ? "Kontakt" : "Contact"}</a>
      &nbsp;·&nbsp;
      <a href="https://einfachamt.com/datenschutz" style="color:#9ca3af;">${isDe ? "Datenschutz" : "Privacy"}</a>
    </p>
  </div>
</body>
</html>`;

  await send({
    to,
    subject: isDe ? "Willkommen bei EinfachAmt 👋" : "Welcome to EinfachAmt 👋",
    html,
  });
}

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

export async function sendAnalysisEmail(params: AnalysisEmailParams): Promise<void> {
  const isDe = params.language === "de";
  await send({
    to: params.to,
    subject: isDe ? "Dein Brief wurde ausgelesen ✓" : "Your letter has been read ✓",
    html: buildHtml(params),
  });
}
