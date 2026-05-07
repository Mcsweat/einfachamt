# Azure OCR Setup

EinfachAmt can use Azure AI Document Intelligence for production OCR.

## Why Azure

Azure Document Intelligence `prebuilt-read` supports document OCR for PDFs and scanned images. It is better suited to Vercel than local Tesseract because the OCR work runs in Azure instead of inside a serverless function.

Official docs:

- https://learn.microsoft.com/en-us/azure/ai-services/document-intelligence/concept-read

## Create the Azure resource

1. Open Azure Portal.
2. Create **Azure AI Document Intelligence** resource.
3. Choose a region near EU users if available.
4. Use the free tier if available for your account.
5. Copy:
   - endpoint
   - key

## Vercel env vars

Add these in Vercel project settings:

```env
OCR_PROVIDER=azure
AZURE_DOCUMENT_INTELLIGENCE_ENDPOINT=https://your-resource.cognitiveservices.azure.com
AZURE_DOCUMENT_INTELLIGENCE_KEY=your-azure-key
```

Redeploy after saving.

## Verify

Open:

```text
https://your-domain/api/ocr/status
```

Expected:

```json
{
  "provider": "azure",
  "azureConfigured": true,
  "azureEnabled": true,
  "pdfSupport": "yes"
}
```

Then upload a PDF, JPG, or PNG and check `documents.extracted_text`.
