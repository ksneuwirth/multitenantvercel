const VERCEL_API_VERSION = "v10";
const VERCEL_PROJECT_ID = process.env.VERCEL_PROJECT_ID;
const VERCEL_ACCESS_TOKEN = process.env.VERCEL_ACCESS_TOKEN;

export class MissingVercelConfigError extends Error {
  constructor() {
    super("VERCEL_PROJECT_ID and VERCEL_ACCESS_TOKEN must be set to call the Domain API");
  }
}

export const ensureVercelEnv = () => {
  if (!VERCEL_PROJECT_ID || !VERCEL_ACCESS_TOKEN) {
    throw new MissingVercelConfigError();
  }

  return {
    projectId: VERCEL_PROJECT_ID,
    token: VERCEL_ACCESS_TOKEN,
  } as const;
};

export type DomainResult = {
  name: string;
  verified: boolean;
  addedAt?: string;
  projectId?: string;
  error?: { code: string; message: string };
};

export const addDomainToProject = async (domain: string): Promise<DomainResult> => {
  const { projectId, token } = ensureVercelEnv();
  const response = await fetch(
    `https://api.vercel.com/${VERCEL_API_VERSION}/projects/${projectId}/domains`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ name: domain }),
      cache: "no-store",
    }
  );

  const payload = (await response.json()) as DomainResult;

  if (!response.ok) {
    throw new Error(payload.error?.message ?? "Vercel Domain API request failed");
  }

  return payload;
};
