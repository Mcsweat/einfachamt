# EinfachAmt Supabase Setup

This project is ready for a real upload flow. The app still uses mock OCR and mock analysis.

## 1. Create a Supabase project

Create a project in Supabase and copy:

- Project URL
- anon public key

## 2. Add local env

Create `.env.local`:

```env
NEXT_PUBLIC_SUPABASE_URL=your-project-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=server-side-placeholder
STRIPE_SECRET_KEY=sk_test_placeholder
NEXT_PUBLIC_SITE_URL=http://localhost:3000
OCR_PROVIDER=google
GOOGLE_DOCUMENT_AI_PROJECT_ID=your-google-cloud-project-id
GOOGLE_DOCUMENT_AI_LOCATION=eu
GOOGLE_DOCUMENT_AI_PROCESSOR_ID=your-processor-id
GOOGLE_DOCUMENT_AI_SERVICE_ACCOUNT_BASE64=base64-encoded-service-account-json
```

Restart the dev server after adding env variables.

## 3. Run SQL

Open Supabase SQL Editor and run:

```text
supabase/schema.sql
```

This creates:

- `documents`
- `analyses`
- `response_drafts`
- private Storage bucket `documents`
- Row Level Security policies

## 4. Enable anonymous auth

In Supabase:

Authentication -> Sign In / Providers -> Anonymous sign-ins -> Enable

The MVP uses anonymous auth so stressed users can upload first without an account wall.

## 5. Enable email login

In Supabase:

Authentication -> Sign In / Providers -> Email -> Enable

Then open Authentication -> URL Configuration.

Site URL:

```text
https://www.einfachamt.com
```

Redirect URLs:

```text
https://www.einfachamt.com/auth/callback
https://www.einfachamt.com/**
http://127.0.0.1:3000/**
```

Plus checkout requires email login so subscriptions are remembered across devices.

## 6. Verify

Open:

```text
http://127.0.0.1:3000/api/supabase/status
```

Expected ready response:

```json
{
  "ok": true,
  "checks": {
    "anonymousAuth": "ok",
    "documentsBucket": "ok"
  }
}
```

Then upload a PDF, JPG, or PNG at `/upload`.

## Current behavior

After upload:

1. File goes to private Supabase Storage bucket `documents`
2. Metadata is inserted into `documents`
3. User is redirected to `/loading/[documentId]`
4. PDF/JPG/PNG files are read with Google Document AI when `OCR_PROVIDER=google`
5. JPG/PNG files can use Tesseract locally when `OCR_PROVIDER=tesseract`
6. The app still shows mock analysis

Real AI analysis is the next milestone.
