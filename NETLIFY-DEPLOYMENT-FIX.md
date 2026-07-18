# Netlify deployment fix

This package contains the complete public Next.js routes plus the admin CMS.

Required route files include:
- app/page.tsx
- app/layout.tsx
- app/menu/[state]/page.tsx
- app/deals/page.tsx
- app/about/page.tsx
- app/editorial-policy/page.tsx
- app/sitemap.ts
- app/api/subscribe/route.ts

Netlify settings:
- Base directory: blank
- Build command: npm run build
- Publish directory: .next
- Production branch: main

After replacing the incomplete GitHub repository contents, run **Clear cache and deploy site** in Netlify.
