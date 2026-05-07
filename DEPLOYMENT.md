# EinfachAmt Deployment

## Vercel

1. Push this folder to GitHub.
2. Import the repository in Vercel.
3. Use the default Next.js settings.
4. Add environment variables:

```env
NEXT_PUBLIC_SUPABASE_URL=https://nunanvvnotqgpsmlobwg.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-publishable-key
NEXT_PUBLIC_SITE_URL=https://your-domain.de
STRIPE_SECRET_KEY=sk_test_placeholder
STRIPE_PRICE_ID=price_placeholder
STRIPE_WEBHOOK_SECRET=whsec_placeholder
OCR_PROVIDER=google
GOOGLE_DOCUMENT_AI_PROJECT_ID=your-google-cloud-project-id
GOOGLE_DOCUMENT_AI_LOCATION=eu
GOOGLE_DOCUMENT_AI_PROCESSOR_ID=your-processor-id
GOOGLE_DOCUMENT_AI_SERVICE_ACCOUNT_BASE64=base64-encoded-service-account-json
GOOGLE_DOCUMENT_AI_PAYWALL=on
EINFACHAMT_PAID_OCR_OVERRIDE=false
```

Do not add `SUPABASE_SERVICE_ROLE_KEY` until server-only OCR/admin jobs need it.

## Domain

1. Vercel project -> Settings -> Domains
2. Add your domain.
3. Set the DNS records Vercel shows.
4. After DNS is ready, update:

```env
NEXT_PUBLIC_SITE_URL=https://your-domain.de
```

## Supabase Auth URLs

Supabase -> Authentication -> URL Configuration:

Site URL:

```text
https://your-domain.de
```

Redirect URLs:

```text
https://your-domain.de/**
http://127.0.0.1:3000/**
```

## Current production state

- Real Supabase upload: yes
- Private Storage bucket: yes
- Mock read/analyze pipeline: yes
- Google Document AI OCR for PDF/JPG/PNG: configured, but paywalled by default
- Tesseract OCR for JPG/PNG: local fallback
- Real AI analysis: not yet
- Stripe Checkout: yes, when Stripe env vars and webhook are configured
