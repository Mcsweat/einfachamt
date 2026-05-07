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
OCR_PROVIDER=tesseract
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

## 5. Verify

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
4. JPG/PNG files are read with Tesseract OCR when `OCR_PROVIDER=tesseract`
5. PDF files still use mock OCR fallback
6. The app still shows mock analysis

Real PDF OCR and real AI analysis are the next milestones.
