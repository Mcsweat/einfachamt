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
OCR_PROVIDER=azure
AZURE_DOCUMENT_INTELLIGENCE_ENDPOINT=https://your-resource.cognitiveservices.azure.com
AZURE_DOCUMENT_INTELLIGENCE_KEY=your-azure-key
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
- Azure OCR for PDF/JPG/PNG: yes, when Azure env vars are configured
- Tesseract OCR for JPG/PNG: local fallback
- Real AI analysis: not yet
- Stripe Checkout: placeholder only
