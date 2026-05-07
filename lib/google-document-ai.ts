import { createSign } from "node:crypto";

type ServiceAccount = {
  client_email?: string;
  private_key?: string;
  token_uri?: string;
};

type DocumentAiResponse = {
  document?: {
    text?: string;
  };
  error?: {
    message?: string;
  };
};

const cloudPlatformScope = "https://www.googleapis.com/auth/cloud-platform";
const defaultTokenUri = "https://oauth2.googleapis.com/token";

function getEnvValue(name: string) {
  return process.env[name]?.trim();
}

function encodeBase64Url(value: string | Buffer) {
  return Buffer.from(value).toString("base64url");
}

function getServiceAccount() {
  const encoded = getEnvValue("GOOGLE_DOCUMENT_AI_SERVICE_ACCOUNT_BASE64");
  const rawJson = process.env.GOOGLE_DOCUMENT_AI_SERVICE_ACCOUNT_JSON;
  const raw = encoded
    ? Buffer.from(encoded, "base64").toString("utf8")
    : rawJson;

  if (!raw) {
    return null;
  }

  try {
    return JSON.parse(raw) as ServiceAccount;
  } catch {
    return null;
  }
}

export function isGoogleDocumentAiConfigured() {
  const serviceAccount = getServiceAccount();

  return Boolean(
    getEnvValue("GOOGLE_DOCUMENT_AI_PROJECT_ID") &&
      getEnvValue("GOOGLE_DOCUMENT_AI_LOCATION") &&
      getEnvValue("GOOGLE_DOCUMENT_AI_PROCESSOR_ID") &&
      serviceAccount?.client_email &&
      serviceAccount?.private_key,
  );
}

async function getAccessToken(serviceAccount: ServiceAccount) {
  if (!serviceAccount.client_email || !serviceAccount.private_key) {
    throw new Error("Google Service Account ist unvollstaendig.");
  }

  const tokenUri = serviceAccount.token_uri ?? defaultTokenUri;
  const now = Math.floor(Date.now() / 1000);
  const header = { alg: "RS256", typ: "JWT" };
  const payload = {
    iss: serviceAccount.client_email,
    scope: cloudPlatformScope,
    aud: tokenUri,
    iat: now,
    exp: now + 3600,
  };

  const unsignedToken = `${encodeBase64Url(JSON.stringify(header))}.${encodeBase64Url(
    JSON.stringify(payload),
  )}`;
  const signature = createSign("RSA-SHA256")
    .update(unsignedToken)
    .sign(serviceAccount.private_key);
  const assertion = `${unsignedToken}.${signature.toString("base64url")}`;

  const response = await fetch(tokenUri, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      grant_type: "urn:ietf:params:oauth:grant-type:jwt-bearer",
      assertion,
    }),
  });

  const data = (await response.json()) as {
    access_token?: string;
    error_description?: string;
    error?: string;
  };

  if (!response.ok || !data.access_token) {
    throw new Error(
      data.error_description ??
        data.error ??
        "Google Auth konnte kein Access Token erstellen.",
    );
  }

  return data.access_token;
}

export async function extractTextWithGoogleDocumentAi(
  file: Blob,
  fileType: string,
) {
  const serviceAccount = getServiceAccount();
  const projectId = getEnvValue("GOOGLE_DOCUMENT_AI_PROJECT_ID");
  const location = getEnvValue("GOOGLE_DOCUMENT_AI_LOCATION");
  const processorId = getEnvValue("GOOGLE_DOCUMENT_AI_PROCESSOR_ID");

  if (
    !serviceAccount?.client_email ||
    !serviceAccount.private_key ||
    !projectId ||
    !location ||
    !processorId
  ) {
    return "";
  }

  const token = await getAccessToken(serviceAccount);
  const content = Buffer.from(await file.arrayBuffer()).toString("base64");
  const endpoint = `https://${location}-documentai.googleapis.com/v1/projects/${projectId}/locations/${location}/processors/${processorId}:process`;

  const response = await fetch(endpoint, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      rawDocument: {
        content,
        mimeType: fileType,
      },
    }),
  });

  const data = (await response.json()) as DocumentAiResponse;

  if (!response.ok) {
    throw new Error(
      data.error?.message ?? "Google Document AI konnte den Brief nicht lesen.",
    );
  }

  return data.document?.text?.trim() ?? "";
}
