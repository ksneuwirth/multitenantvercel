import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { SiteShell } from "@/components/site-shell";
import {
  getDocBySlug,
  getDocsNavigation,
  getSiteBySlug,
  getTenantUrl,
} from "@/lib/sites";

type TenantPageProps = {
  params: Promise<{
    site: string;
    slug?: string[];
  }>;
};

export async function generateMetadata({ params }: TenantPageProps): Promise<Metadata> {
  const resolvedParams = await params;
  const site = getSiteBySlug(resolvedParams.site);
  if (!site) {
    return {
      title: "Tenant not found",
    };
  }

  const doc = getDocBySlug(site.slug, resolvedParams.slug ?? []);
  if (!doc) {
    return {
      title: site.name,
      description: site.description,
    };
  }

  return {
    title: `${doc.title} · ${site.name}`,
    description: doc.summary,
    alternates: {
      canonical: getTenantUrl(site, `/${doc.slug.join("/")}`),
    },
  };
}

const renderParagraph = (paragraph: string, key: string) => {
  const segments = paragraph.split(/`([^`]+)`/g);
  return segments.map((segment, index) =>
    index % 2 === 1 ? (
      <code
        key={`${key}-code-${index}`}
        className="rounded bg-white/10 px-1 font-mono text-sm text-slate-100"
      >
        {segment}
      </code>
    ) : (
      segment
    )
  );
};

export default async function TenantDocPage({ params }: TenantPageProps) {
  const resolvedParams = await params;
  const site = getSiteBySlug(resolvedParams.site);
  if (!site) {
    notFound();
  }

  const doc = getDocBySlug(site.slug, resolvedParams.slug ?? []);
  if (!doc) {
    notFound();
  }

  const navigation = getDocsNavigation(site.slug);

  return (
    <SiteShell site={site} docs={navigation} activeDoc={doc}>
      {doc.content.map((section) => (
        <section key={section.heading}>
          <h2>{section.heading}</h2>
          {section.copy.map((paragraph, index) => (
            <p key={`${section.heading}-${index}`}>
              {renderParagraph(paragraph, `${section.heading}-${index}`)}
            </p>
          ))}
        </section>
      ))}
    </SiteShell>
  );
}
