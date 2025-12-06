import { sites } from "@/data/sites";
import type { SiteDefinition, SiteDoc } from "@/data/sites";

const normalizeHost = (host?: string | null) => {
  if (!host) return "";
  return host
    .toLowerCase()
    .replace(/https?:\/\//g, "")
    .split(":")[0]
    .trim();
};

const RAW_PLATFORM_DOMAIN =
  process.env.NEXT_PUBLIC_PLATFORM_DOMAIN ?? "platform.localhost";
const RAW_TENANT_DOMAIN =
  process.env.NEXT_PUBLIC_TENANT_ROOT_DOMAIN ?? "docs.localhost";
const DEFAULT_PROTOCOL =
  process.env.NEXT_PUBLIC_PLATFORM_PROTOCOL ??
  (process.env.NODE_ENV === "development" ? "http" : "https");

const PLATFORM_DOMAIN = normalizeHost(RAW_PLATFORM_DOMAIN) || "localhost";
const TENANT_DOMAIN = normalizeHost(RAW_TENANT_DOMAIN) || PLATFORM_DOMAIN;

const platformHosts = new Set(
  (process.env.NEXT_PUBLIC_PLATFORM_HOSTS ?? "")
    .split(",")
    .map((value) => normalizeHost(value))
    .filter(Boolean)
);

platformHosts.add(PLATFORM_DOMAIN);
platformHosts.add("localhost");
platformHosts.add("127.0.0.1");

const unique = <T,>(value: T, index: number, array: T[]) =>
  array.indexOf(value) === index;

const candidateHostsForSite = (site: SiteDefinition) => {
  const slug = site.subdomain || site.slug;
  const guesses = [
    `${slug}.${TENANT_DOMAIN}`,
    `${slug}.${PLATFORM_DOMAIN}`,
    `${slug}.localhost`,
    `${slug}.127.0.0.1`,
    site.customDomain,
    ...(site.domains ?? []),
  ]
    .map((item) => normalizeHost(item))
    .filter(Boolean)
    .filter(unique);

  return guesses;
};

export type SiteMatch = {
  site: SiteDefinition;
  matchedDomain: string;
  type: "custom" | "subdomain";
};

export const getAllSites = () => sites;

export const getSiteBySlug = (slug: string) =>
  sites.find((site) => site.slug === slug);

export const getDocBySlug = (siteSlug: string, docSlug: string[] = []) => {
  const site = getSiteBySlug(siteSlug);
  if (!site) return undefined;

  const target = (docSlug ?? []).join("/");
  return site.docs.find((doc) => doc.slug.join("/") === target);
};

export const getDocsNavigation = (siteSlug: string) => {
  const site = getSiteBySlug(siteSlug);
  if (!site) return [];

  return site.docs.map((doc) => ({
    title: doc.title,
    summary: doc.summary,
    path: buildDocPath(site.slug, doc.slug),
  }));
};

export const buildDocPath = (siteSlug: string, slugParts: string[] = []) => {
  const suffix = slugParts.length ? `/${slugParts.join("/")}` : "";
  return `${siteSlug}${suffix}`;
};

export const listDomainOptions = (site: SiteDefinition) =>
  candidateHostsForSite(site);

export const listPlatformHosts = () => Array.from(platformHosts);

export const getTenantUrl = (site: SiteDefinition, path = "/") => {
  const domain = site.customDomain ?? `${site.subdomain}.${TENANT_DOMAIN}`;
  return `${DEFAULT_PROTOCOL}://${domain}${path}`;
};

export const getSiteByHost = (host?: string | null): SiteMatch | undefined => {
  const incomingHost = normalizeHost(host);
  if (!incomingHost || platformHosts.has(incomingHost)) {
    return undefined;
  }

  for (const site of sites) {
    const candidates = candidateHostsForSite(site);
    for (const candidate of candidates) {
      if (candidate === incomingHost) {
        return {
          site,
          matchedDomain: candidate,
          type: candidate === normalizeHost(site.customDomain)
            ? "custom"
            : "subdomain",
        };
      }
    }
  }

  return undefined;
};

export const getSiteHeadline = (site: SiteDefinition) =>
  `${site.name} · ${site.description}`;

export type SiteAndDoc = {
  site: SiteDefinition;
  doc: SiteDoc;
};
