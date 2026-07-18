# Validation Report

Validation date: July 18, 2026

## Passed checks

- `npm run seo:audit`
  - 52 state/jurisdiction content records found
  - Minimum built-in editorial body: 1,002 words
- `npm run typecheck`
  - Passed with no TypeScript errors
- `npm run build`
  - Next.js production build passed
  - 64 application routes generated
  - All 52 `/menu/[state]` routes prerendered
- `npm audit --omit=dev`
  - 0 known vulnerabilities at packaging time
- Runtime crawl audit
  - 52/52 state pages returned HTTP 200
  - 52/52 state pages output `index, follow`
  - 52/52 state pages output a self-referencing canonical
  - 52 state URLs present in sitemap.xml
  - Minimum rendered state-page word count: 1,866 words including structured page sections, excluding HTML markup
  - Admin login outputs `noindex, nofollow`
  - robots.txt allows public crawling and blocks `/admin/` and `/api/`

## Deployment reminder

Set the production domain in both:

- Hostinger environment variable `NEXT_PUBLIC_SITE_URL`
- Admin → Integrations → Site URL

Then redeploy so canonical URLs, sitemap URLs, schema URLs, and robots.txt use the final domain.
