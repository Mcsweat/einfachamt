type AzureAnalyzeResult = {
  status?: "notStarted" | "running" | "succeeded" | "failed";
  analyzeResult?: {
    content?: string;
    paragraphs?: Array<{
      content?: string;
    }>;
  };
  error?: {
    message?: string;
  };
};

const apiVersion = "2024-11-30";

function getAzureConfig() {
  const endpoint = process.env.AZURE_DOCUMENT_INTELLIGENCE_ENDPOINT?.replace(
    /\/$/,
    "",
  );
  const key = process.env.AZURE_DOCUMENT_INTELLIGENCE_KEY;

  if (!endpoint || !key) {
    return null;
  }

  return { endpoint, key };
}

function getResultText(result: AzureAnalyzeResult) {
  if (result.analyzeResult?.content) {
    return result.analyzeResult.content.trim();
  }

  return (
    result.analyzeResult?.paragraphs
      ?.map((paragraph) => paragraph.content)
      .filter(Boolean)
      .join("\n\n")
      .trim() ?? ""
  );
}

async function wait(ms: number) {
  await new Promise((resolve) => setTimeout(resolve, ms));
}

export function isAzureOcrConfigured() {
  return Boolean(getAzureConfig());
}

export async function extractTextWithAzure(file: Blob, fileType: string) {
  const config = getAzureConfig();

  if (!config) {
    return null;
  }

  const analyzeUrl =
    `${config.endpoint}/documentintelligence/documentModels/prebuilt-read:analyze` +
    `?_overload=analyzeDocument&api-version=${apiVersion}&locale=de-DE`;

  const analyzeResponse = await fetch(analyzeUrl, {
    method: "POST",
    headers: {
      "Content-Type": fileType,
      "Ocp-Apim-Subscription-Key": config.key,
    },
    body: Buffer.from(await file.arrayBuffer()),
  });

  if (!analyzeResponse.ok) {
    throw new Error(
      `Azure OCR konnte nicht gestartet werden: ${await analyzeResponse.text()}`,
    );
  }

  const operationLocation = analyzeResponse.headers.get("operation-location");

  if (!operationLocation) {
    throw new Error("Azure OCR hat keine Operation-Location zurückgegeben.");
  }

  for (let attempt = 0; attempt < 18; attempt += 1) {
    await wait(1000);

    const resultResponse = await fetch(operationLocation, {
      headers: {
        "Ocp-Apim-Subscription-Key": config.key,
      },
    });

    if (!resultResponse.ok) {
      throw new Error(
        `Azure OCR Ergebnis konnte nicht gelesen werden: ${await resultResponse.text()}`,
      );
    }

    const result = (await resultResponse.json()) as AzureAnalyzeResult;

    if (result.status === "succeeded") {
      const text = getResultText(result);

      if (!text) {
        throw new Error("Azure OCR hat keinen Text erkannt.");
      }

      return text;
    }

    if (result.status === "failed") {
      throw new Error(result.error?.message ?? "Azure OCR ist fehlgeschlagen.");
    }
  }

  throw new Error("Azure OCR hat zu lange gedauert.");
}
