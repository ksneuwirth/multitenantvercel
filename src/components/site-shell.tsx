import Link from "next/link";
import type { SiteDefinition, SiteDoc } from "@/data/sites";
import { buildDocPath, getTenantUrl, listDomainOptions } from "@/lib/sites";
import { DomainPill } from "./domain-pill";

type NavigationItem = {
  title: string;
  summary: string;
  path: string;
};

type SiteShellProps = {
  site: SiteDefinition;
  docs: NavigationItem[];
  activeDoc: SiteDoc;
  children: React.ReactNode;
};

export function SiteShell({ site, docs, activeDoc, children }: SiteShellProps) {
  const domainOptions = listDomainOptions(site);

  return (
    <div className="min-h-screen bg-slate-950">
      <div className="mx-auto flex max-w-6xl gap-8 px-6 py-12 lg:px-12">
        <aside className="hidden w-72 shrink-0 space-y-8 lg:block">
          <div className="space-y-2">
            <p className="text-xs uppercase tracking-[0.3em] text-slate-400">Docs</p>
            <h1 className="text-2xl font-semibold text-white">{site.name}</h1>
            <p className="text-sm text-slate-400">{site.tagline}</p>
          </div>
          <div className="space-y-3">
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
              Domains
            </p>
            <div className="flex flex-wrap gap-2">
              {domainOptions.map((domain) => (
                <DomainPill key={domain} label={domain} variant="outline" />
              ))}
            </div>
          </div>
          <nav className="space-y-1">
            {docs.map((doc) => {
              const href = `/${doc.path}`;
              const isActive = doc.path === buildDocPath(site.slug, activeDoc.slug);

              return (
                <Link
                  key={doc.path}
                  href={href}
                  className={`block rounded-md border border-transparent px-3 py-2 text-sm transition hover:border-white/20 hover:bg-white/5 ${
                    isActive ? "border-white/30 bg-white/10" : "text-slate-300"
                  }`}
                >
                  <span className="block font-medium text-white">{doc.title}</span>
                  <span className="text-xs text-slate-400">{doc.summary}</span>
                </Link>
              );
            })}
          </nav>
          <div className="rounded-2xl border border-white/5 bg-white/5 p-4 text-sm text-slate-200">
            <p className="font-semibold text-white">Preview this tenant</p>
            <p className="text-slate-400">
              Run <code className="font-mono text-xs">{getTenantUrl(site)}</code> after pointing the
              domain to this Vercel project.
            </p>
          </div>
        </aside>
        <main className="flex-1 space-y-8">
          <div className="lg:hidden">
            <p className="text-xs uppercase tracking-[0.3em] text-slate-400">
              {site.name}
            </p>
            <p className="text-sm text-slate-400">{site.tagline}</p>
            <div className="mt-4 flex flex-wrap gap-2">
              {domainOptions.map((domain) => (
                <DomainPill key={domain} label={domain} variant="outline" />
              ))}
            </div>
            <div className="mt-4 grid gap-2">
              {docs.map((doc) => {
                const href = `/${doc.path}`;
                const isActive =
                  doc.path === buildDocPath(site.slug, activeDoc.slug);

                return (
                  <Link
                    key={doc.path}
                    href={href}
                    className={`rounded-xl border px-3 py-2 text-sm ${
                      isActive
                        ? "border-white/40 bg-white/10 text-white"
                        : "border-white/10 text-slate-300"
                    }`}
                  >
                    {doc.title}
                  </Link>
                );
              })}
            </div>
          </div>
          <header className="rounded-3xl border border-white/10 bg-gradient-to-r from-white/[0.04] to-white/[0.01] p-6 shadow-glow">
            <p className="text-xs uppercase tracking-[0.35em] text-white/60">
              {site.industries.join(" • ")}
            </p>
            <h1 className="mt-3 text-3xl font-semibold text-white">{activeDoc.title}</h1>
            <p className="mt-2 text-base text-slate-300">{activeDoc.summary}</p>
            <p className="mt-4 text-xs text-slate-400">
              Last updated {new Date(activeDoc.updatedAt).toLocaleDateString(undefined, { dateStyle: "medium" })}
            </p>
          </header>
          <article className="prose prose-invert max-w-none">
            {children}
          </article>
        </main>
      </div>
    </div>
  );
}
