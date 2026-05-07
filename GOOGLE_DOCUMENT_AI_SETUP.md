# EinfachAmt Google Document AI OCR Setup

Google Document AI is the recommended OCR provider for the MVP because it can read PDF, JPG, and PNG files in one server-side flow.

Official docs:

- Raw document request: https://cloud.google.com/document-ai/docs/reference/rest/v1/RawDocument
- Create/process documents: https://cloud.google.com/document-ai/docs/process-documents-client-libraries
- Enterprise OCR processor: https://cloud.google.com/document-ai/docs/processors-list

## 1. Create the Google processor

1. Open Google Cloud Console.
2. Create or select a Google Cloud project.
3. Enable the Document AI API.
4. Go to Document AI -> Processors.
5. Create an `Enterprise Document OCR` processor.
6. Choose location `eu` for an EU endpoint when possible.
7. Copy the processor ID.

## 2. Create a service account

1. Go to IAM & Admin -> Service Accounts.
2. Create a service account for EinfachAmt OCR.
3. Give it permission to call Document AI, for example `Document AI API User`.
4. Create a JSON key and download it.

Keep this JSON private. Do not commit it to GitHub.

## 3. Convert the JSON key for Vercel

In PowerShell, run this from the folder where the JSON key is saved:

```powershell
[Convert]::ToBase64String([Text.Encoding]::UTF8.GetBytes((Get-Content .\service-account.json -Raw)))
```

Copy the output.

## 4. Add Vercel environment variables

Vercel -> Project -> Settings -> Environment Variables:

```env
OCR_PROVIDER=google
GOOGLE_DOCUMENT_AI_PROJECT_ID=your-google-cloud-project-id
GOOGLE_DOCUMENT_AI_LOCATION=eu
GOOGLE_DOCUMENT_AI_PROCESSOR_ID=your-processor-id
GOOGLE_DOCUMENT_AI_SERVICE_ACCOUNT_BASE64=the-long-base64-output
```

Use `Production and Preview`, then redeploy.

## 5. Check the app

Open:

```text
https://your-domain.de/api/ocr/status
```

Expected:

```json
{
  "ok": true,
  "provider": "google",
  "googleConfigured": true,
  "googleEnabled": true,
  "pdfSupport": "yes"
}
```

Then upload a new PDF, JPG, or PNG. In Supabase, the `documents.extracted_text` column should contain real OCR text instead of mock text.
