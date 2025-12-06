import Link from "next/link";
import { DomainPill } from "@/components/domain-pill";
import {
  getAllSites,
  getTenantUrl,
  listDomainOptions,
} from "@/lib/sites";

const highlights = [
  {
    title: "Edge rewrites",
    description:
      "`middleware.ts` inspects `request.headers.host`, matches a tenant, and rewrites to the correct route tree without extra deployments.",
  },
  {
    title: "Isolated content",
    description:
      "Each tenant lives under `app/[site]/[[...slug]]`, so content, metadata, and SEO primitives stay scoped to that tenant.",
  },
  {
    title: "Domain automation",
    description:
      "`POST /api/platform/domains` shows how to forward custom domain requests to Vercel's Domain API for verification.",
  },
];

export default function MarketingPage() {
  const sites = getAllSites();

  return (
    <div className="min-h-screen">
      <div className="mx-auto max-w-6xl space-y-16 px-6 py-16 lg:px-12">
        <section className="rounded-3xl border border-white/10 bg-gradient-to-r from-white/[0.08] to-white/[0.02] p-10 shadow-glow">
          <p className="text-sm uppercase tracking-[0.4em] text-white/70">
            Multi-tenant Next.js
          </p>
          <h1 className="mt-4 text-4xl font-semibold text-white lg:text-5xl">
            Serve documentation for every customer under their own domain.
          </h1>
          <p className="mt-6 text-lg text-slate-200">
            This project translates the Vercel multi-tenant platform guidance into a working Next.js
            starter. Point custom domains at a single Vercel project, let middleware route requests,
            and keep every tenant docs tree scoped and cacheable.
          </p>
          <div className="mt-8 flex flex-wrap gap-4 text-sm font-medium">
            <Link
              className="rounded-full bg-white px-5 py-3 text-slate-900"
              href="https://vercel.com/platforms/platforms/docs/multi-tenant-platforms/concepts"
              target="_blank"
              rel="noreferrer"
            >
              Read the Vercel concept doc
            </Link>
            <Link
              className="rounded-full border border-white/40 px-5 py-3 text-white"
              href="/api/platform/domains"
            >
              Inspect the Domain API route
            </Link>
          </div>
        </section>

        <section className="grid gap-6 lg:grid-cols-3">
          {highlights.map((item) => (
            <div key={item.title} className="rounded-2xl border border-white/5 bg-white/5 p-6">
              <p className="text-xs font-semibold uppercase tracking-[0.35em] text-white/60">
                {item.title}
              </p>
              <p className="mt-4 text-sm text-slate-200">{item.description}</p>
            </div>
          ))}
        </section>

        <section className="space-y-8">
          <div className="flex items-baseline justify-between">
            <div>
              <p className="text-xs uppercase tracking-[0.3em] text-white/60">Tenants</p>
              <h2 className="text-2xl font-semibold">Sample customer docs</h2>
            </div>
            <p className="text-sm text-slate-400">
              Each tenant provides a subdomain + optional custom domain. Add yours in `src/data/sites.ts`.
            </p>
          </div>
          <div className="grid gap-6 lg:grid-cols-3">
            {sites.map((site) => (
              <div
                key={site.slug}
                className="rounded-3xl border border-white/10 bg-white/[0.04] p-6"
                style={{ boxShadow: `0 40px 90px ${site.theme.glow}33` }}
              >
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <p className="text-xs uppercase tracking-[0.4em] text-white/60">
                      {site.industries.join(" • ")}
                    </p>
                    <h3 className="mt-2 text-xl font-semibold text-white">{site.name}</h3>
                  </div>
                  <DomainPill label={`${site.subdomain}.<tenant-domain>`} />
                </div>
                <p className="mt-4 text-sm text-slate-200">{site.description}</p>
                <div className="mt-4 flex flex-wrap gap-2">
                  {listDomainOptions(site).map((domain) => (
                    <DomainPill key={domain} label={domain} variant="outline" />
                  ))}
                </div>
                <div className="mt-6 space-y-2 text-sm text-slate-200">
                  {site.featuredLinks.map((link) => (
                    <Link
                      key={link.path}
                      href={`/${site.slug}/${link.path}`}
                      className="flex items-center justify-between rounded-xl border border-white/5 bg-white/5 px-4 py-3 text-sm transition hover:border-white/20 hover:bg-white/10"
                    >
                      <span>{link.label}</span>
                      <span className="text-xs text-slate-400">→</span>
                    </Link>
                  ))}
                </div>
                <p className="mt-6 text-xs text-slate-400">
                  Preview via <span className="font-mono">{getTenantUrl(site)}</span>
                </p>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
