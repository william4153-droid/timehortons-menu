# Tim Hortons Menu USA — Netlify CMS Edition

A Next.js 16 web app for 52 U.S. jurisdictions: all 50 states, Washington, D.C., and Puerto Rico. It includes an editable Supabase-backed admin panel, menu/deal/location management, subscriptions, SEO controls, Google integrations, and Netlify deployment configuration.

## Included features

### Public website

- 52 jurisdiction routes under `/menu/[state]`
- Database-controlled page titles, H1s, introductions, body copy, metadata, index/noindex status, and publish status
- Editable global menu categories and menu items
- Editable deals, coupons, terms, dates, and source notes
- Editable state locations, cities, addresses, phone numbers, and official links
- Arbitrary custom CMS pages at routes such as `/guides/coffee-prices`
- Homepage, Deals, About, Editorial Policy, and Privacy pages connected to the CMS
- Dynamic sitemap, robots.txt, structured data, internal links, newsletter form, and ads.txt
- Database fallbacks so the public site still builds before Supabase is configured

### Admin panel

Open `/admin/login` after deployment.

- Dashboard
- Pages: edit all seeded pages or add custom pages
- Menu: add/edit/delete/reorder categories and menu items
- Deals: add/edit/delete offers and availability dates
- Locations: manage entries by state or jurisdiction
- Subscribers: activate or suppress email records
- Integrations:
  - Google Analytics 4 Measurement ID
  - Google AdSense publisher ID and ad slots
  - Dynamic ads.txt publisher record
  - Google Search Console HTML-tag verification token
  - Search Console property URL and sitemap guidance

## Technology

- Next.js App Router with SSR, ISR, route handlers, and protected server actions
- Netlify Next.js runtime
- Supabase Postgres and Auth
- Google Analytics 4
- Google AdSense
- Google Search Console verification
- Optional Resend newsletter script

## 1. Create the Supabase backend

1. Create a Supabase project.
2. Open **SQL Editor**.
3. Run `supabase/schema.sql`.
4. Run `supabase/seed.sql`.

The seed creates:

- 57 editable CMS records: homepage, four system pages, and all 52 jurisdiction pages
- Menu categories and items
- Current deal records
- 361 initial city/location records
- Default site settings

The seed is safe to run again. It does not overwrite manually edited CMS pages.

## 2. Create the first admin login

1. In Supabase, open **Authentication → Users**.
2. Create a user with an email address and password.
3. Add that exact email to the Netlify environment variable `ADMIN_EMAILS`.

Multiple admins can be allowed with comma-separated emails:

```env
ADMIN_EMAILS=owner@example.com,editor@example.com
```

Alternative: add a Supabase Auth user to `public.admin_users` with the SQL example at the bottom of `supabase/seed.sql`.

## 3. Netlify deployment

### Recommended Git deployment

1. Extract this project.
2. Upload it to a GitHub, GitLab, or Bitbucket repository.
3. In Netlify, choose **Add new project → Import an existing project**.
4. Select the repository.
5. Netlify should detect Next.js. The included `netlify.toml` uses:

```text
Build command: npm run build
Publish directory: .next
Node version: 22
```

6. Add the environment variables listed below.
7. Deploy the site.

Netlify automatically applies its current Next.js adapter; do not configure the project as a static export.

### Netlify CLI deployment

```bash
npm install
npm run build
npx netlify login
npx netlify init
npx netlify deploy --build
npx netlify deploy --build --prod
```

## 4. Netlify environment variables

Add these under **Project configuration → Environment variables**:

```env
NEXT_PUBLIC_SITE_URL=https://your-site.netlify.app
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_publishable_or_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
ADMIN_EMAILS=admin@example.com
```

Optional newsletter variables:

```env
RESEND_API_KEY=re_xxxxxxxxx
NEWSLETTER_FROM=Menu Updates <updates@your-domain.com>
ADMIN_NEWSLETTER_SECRET=replace_with_a_long_random_secret
```

### Security rules

- Never expose `SUPABASE_SERVICE_ROLE_KEY` through a variable beginning with `NEXT_PUBLIC_`.
- Keep the service-role key only in Netlify’s server-side environment variables.
- Disable public signups in Supabase Auth when only administrators should have accounts.
- Use strong passwords and enable MFA for the Supabase account that controls the project.

## 5. Complete setup in the admin panel

After the first deployment:

1. Visit `https://your-domain.com/admin/login`.
2. Sign in with the Supabase Auth user.
3. Open **Integrations**.
4. Replace the default `https://example.com` value with the live domain.
5. Add Google IDs only after creating the corresponding Google properties.
6. Review page metadata and location accuracy before enabling indexing.

## Google Analytics 4

In the admin panel, paste the GA4 Measurement ID in this format:

```text
G-XXXXXXXXXX
```

The app loads the Google tag and records client-side App Router page changes as page-view events.

## Google AdSense

Enter:

- Client ID: `ca-pub-0000000000000000`
- ads.txt publisher ID: `pub-0000000000000000`
- Optional homepage, article, and sidebar ad-unit slot IDs
- Enable the AdSense checkbox

The app then:

- Adds the AdSense account meta tag
- Loads the AdSense script sitewide
- Displays configured responsive ad units
- Serves `/ads.txt` dynamically

Leave the slot fields empty when using AdSense Auto Ads only.

## Google Search Console

Choose HTML-tag verification in Search Console. From this example:

```html
<meta name="google-site-verification" content="verification-token-here" />
```

Paste only:

```text
verification-token-here
```

After saving, verify the property and submit:

```text
https://your-domain.com/sitemap.xml
```

## Editing page content

The CMS body editor supports simple content blocks:

```text
## H2 heading

Paragraph text.

### H3 heading

- List item one
- List item two
```

For state pages, the public template keeps the menu, deals, locations, FAQs, schema, and internal links structured while allowing the admin to edit the state-specific heading, introduction, body, metadata, and indexing status.

## Adding a new page

1. Open **Admin → Pages → Add page**.
2. Select `Custom`.
3. Enter any unused route, for example `/guides/tim-hortons-breakfast`.
4. Add the title, H1, copy, SEO title, and description.
5. Set the page to `Published`.
6. Enable indexing only after the page is complete and useful.

Reserved application routes such as `/admin`, `/api`, `/menu`, and existing system-page routes should not be reused for custom pages.

## Newsletter storage and sending

The public form writes subscribers to Supabase. Review them under **Admin → Subscribers**.

To send an HTML newsletter manually:

```bash
npm run newsletter -- "New Tim Hortons Deals" ./newsletter.html
```

For a production mailing program, add unsubscribe tokens, suppression handling, consent records, rate controls, and applicable privacy/commercial-email compliance.

## Local development

```bash
cp .env.example .env.local
npm install
npm run dev
```

Open:

- Public site: `http://localhost:3000`
- Admin login: `http://localhost:3000/admin/login`

## Validation commands

```bash
npm run typecheck
npm run build
npm audit --omit=dev
```

The delivered package passes TypeScript checking and the production build. The dependency audit reports no known vulnerabilities at packaging time.

## Important content and SEO note

The software provides technical SEO controls, structured templates, metadata, internal linking, schema, sitemap management, and editable local data. It cannot guarantee Google rankings, AI Overview inclusion, AdSense approval, or Search Console indexing. Keep prices, deals, opening information, and location claims accurate and dated; avoid creating fabricated local pages or duplicated low-value content.
