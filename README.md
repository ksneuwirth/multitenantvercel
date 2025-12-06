# Multi-tenant Docs Platform

A reference implementation of [Vercel's multi-tenant platform concept](https://vercel.com/platforms/platforms/docs/multi-tenant-platforms/concepts) using the Next.js App Router. Every tenant can attach a custom domain (or subdomain) while sharing a single Vercel project and deployment pipeline.

## Key ideas

- **Edge-aware routing** – `middleware.ts` inspects the incoming `Host` header, resolves the tenant, and rewrites the request to `app/[site]/[[...slug]]` so each customer is fully isolated.
- **Data-driven tenants** – `src/data/sites.ts` models your tenants (name, docs tree, domain metadata). Swapping in a database later only requires updating `src/lib/sites.ts`.
- **Domain automation** – `POST /api/platform/domains` demonstrates how to forward requested domains to the Vercel Domains API so you can programmatically add customer domains to a single project.
- **Docs UX per tenant** – Each tenant renders through `SiteShell`, keeping navigation, metadata, and canonical URLs scoped to the tenant's own domain.

## Project structure

```
src/
  app/
    page.tsx                 # marketing + platform overview
    [site]/[[...slug]]/      # tenant docs tree
    api/platform/domains/    # thin proxy to Vercel Domain API
  components/                # shared UI (SiteShell, DomainPill, etc.)
  data/sites.ts              # sample tenants + docs content
  lib/sites.ts               # host matching + helpers (buildDocPath, etc.)
  lib/vercel.ts              # Domain API helper
middleware.ts                # rewrites hostnames to the right tenant tree
.env.example                 # platform + Vercel config knobs
```

## Getting started locally

1. Copy the example env file and tweak domains (defaults target `*.localhost`).

   ```bash
   cp .env.example .env.local
   ```

2. Start the dev server.

   ```bash
   npm install
   npm run dev
   ```

3. Visit the marketing surface at [http://platform.localhost:3000](http://platform.localhost:3000). Sample tenant docs are available at:

   - `http://acme.docs.localhost:3000`
   - `http://stellar.docs.localhost:3000`
   - `http://northwind.docs.localhost:3000`

   Any `*.localhost` host resolves to `127.0.0.1`, so no extra hosts file entries are required for development.

## Adding tenants & domains

1. Duplicate an entry in `src/data/sites.ts` and update the metadata plus docs content.
2. Provide at least one of:
   - `subdomain`: becomes `<subdomain>.<NEXT_PUBLIC_TENANT_ROOT_DOMAIN>`
   - `customDomain`: optional vanity domain such as `docs.example.com`
   - `domains`: extra hostnames (useful for migrations or dev fixtures)
3. Deploy to Vercel and point the customer's DNS `CNAME` (or `ANAME`/`ALIAS`) record to your project.
4. Call `POST /api/platform/domains` with `{ "domain": "docs.example.com", "siteSlug": "acme" }` to register the domain with Vercel. Set `VERCEL_PROJECT_ID` and `VERCEL_ACCESS_TOKEN` to make the request succeed.

## Deploying to a single Vercel project

1. Create one project (e.g. `docs-platform`) and deploy this repository.
2. Add the platform domain(s) you want operators to use (e.g. `platform.yourapp.com`) under **Domains**.
3. For each customer domain request:
   - Assign the record to their tenant in your datastore
   - Run the Domain API helper (`POST /api/platform/domains`)
   - Wait for verification (DNS TXT check) if the domain is new
4. Every request now flows through the shared deployment. Middleware rewrites the host to the tenant slug and Next.js renders the correct docs tree.

## Next steps

- Replace `src/data/sites.ts` with your database (PlanetScale, Neon, etc.) and hydrate tenants at request time.
- Persist domain requests and verification events so that CS or Support can see status inside your admin UI.
- Lock tenant routes behind auth if you need private docs—Edge Middleware already knows the tenant, so you can layer on JWT / SSO checks easily.
