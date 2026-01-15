import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { getSiteBySlug } from "@/lib/sites";
import { addDomainToProject, ensureVercelEnv } from "@/lib/vercel";

const domainPattern =
  /^(?:[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?\.)+[a-z]{2,}$/i;

export async function GET() {
  const env = {
    projectConfigured: Boolean(process.env.VERCEL_PROJECT_ID),
    tokenConfigured: Boolean(process.env.VERCEL_ACCESS_TOKEN),
  };

  return NextResponse.json({
    message:
      "POST a JSON body with `{ \"domain\": \"docs.example.com\", \"siteSlug\": \"acme\" }` to forward the domain to Vercel's Domain API.",
    docs: "https://vercel.com/docs/build-output-api/v3#tag/Project-Domains",
    env,
  });
}

export async function POST(request: NextRequest) {
  let body: unknown;

  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { error: "Provide a valid JSON body." },
      { status: 400 }
    );
  }

  if (!body || typeof body !== "object" || Array.isArray(body)) {
    return NextResponse.json(
      { error: "Provide a JSON object with `domain` and `siteSlug`." },
      { status: 400 }
    );
  }

  const { domain, siteSlug } = body as {
    domain?: unknown;
    siteSlug?: unknown;
  };

  if (!domain || typeof domain !== "string" || !domainPattern.test(domain)) {
    return NextResponse.json(
      { error: "Provide a valid domain, e.g. docs.example.com" },
      { status: 400 }
    );
  }

  if (!siteSlug || typeof siteSlug !== "string") {
    return NextResponse.json(
      { error: "`siteSlug` is required and should match an entry in src/data/sites.ts" },
      { status: 400 }
    );
  }

  const site = getSiteBySlug(siteSlug);
  if (!site) {
    return NextResponse.json({ error: "Unknown site" }, { status: 404 });
  }

  try {
    ensureVercelEnv();
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Missing Vercel configuration" },
      { status: 500 }
    );
  }

  try {
    const response = await addDomainToProject(domain);
    return NextResponse.json(
      {
        site: site.name,
        domain: response.name,
        verified: response.verified,
        instructions:
          "If verification is pending, add the returned TXT record to your DNS host and re-run this request.",
      },
      { status: 201 }
    );
  } catch (error) {
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "Domain registration failed",
      },
      { status: 502 }
    );
  }
}
