import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import AdSlot from "@/components/AdSlot";
import statePageContent from "@/data/state-page-content.json";
import CmsBody from "@/components/CmsBody";
import MenuTable from "@/components/MenuTable";
import SubscribeForm from "@/components/SubscribeForm";
import {
  getCmsPageByRoute,
  getDeals,
  getLocationsForJurisdiction,
  getMenuCategories,
  getSiteSettings,
  getStaticMenuCategories,
} from "@/lib/cms";
import { jurisdictions, getJurisdiction } from "@/lib/jurisdictions";
import { DATA_REVIEWED } from "@/lib/menu-data";

export const revalidate = 300;

export function generateStaticParams() {
  return jurisdictions.map((item) => ({ state: item.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ state: string }> }): Promise<Metadata> {
  const { state } = await params;
  const item = getJurisdiction(state);
  if (!item) return {};
  const page = await getCmsPageByRoute(`/menu/${item.slug}`);
  const title = page?.meta_title || `Tim Hortons Menu ${item.name}: Prices, Deals & Locations`;
  const description = page?.meta_description || (item.hasVerifiedLocations
    ? `Review Tim Hortons menu price guidance, current deals and verified location cities in ${item.name}. Updated ${DATA_REVIEWED}.`
    : `Check Tim Hortons menu guidance and current official location availability for ${item.name}. Updated ${DATA_REVIEWED}.`);
  return {
    title,
    description,
    alternates: { canonical: `/menu/${item.slug}` },
    robots: { index: true, follow: true },
    openGraph: { title, description, type: "article" },
  };
}

function citySlug(city: string) {
  return city.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}

export default async function StatePage({ params }: { params: Promise<{ state: string }> }) {
  const { state } = await params;
  const item = getJurisdiction(state);
  if (!item) notFound();

  const [page, dbMenu, deals, dbLocations, settings] = await Promise.all([
    getCmsPageByRoute(`/menu/${item.slug}`),
    getMenuCategories(),
    getDeals(),
    getLocationsForJurisdiction(item.slug),
    getSiteSettings(),
  ]);
  const menu = dbMenu || getStaticMenuCategories();
  const builtInBody = statePageContent[item.slug as keyof typeof statePageContent]?.body || "";
  const cmsBody = page?.body?.trim() || "";
  const cmsWordCount = cmsBody ? cmsBody.split(/\s+/).filter(Boolean).length : 0;
  const editorialBody = cmsWordCount >= 500 ? cmsBody : [cmsBody, builtInBody].filter(Boolean).join("\n\n");
  const locations = dbLocations === null
    ? item.cities.map((city, index) => ({ id: `static-${index}`, jurisdiction_slug: item.slug, city, address: "", phone: "", official_url: `${item.officialStateUrl}${citySlug(city)}/`, sort_order: index, active: true }))
    : dbLocations;
  const hasLocations = locations.length > 0;
  const currentIndex = jurisdictions.findIndex((entry) => entry.slug === item.slug);
  const related = [1, 2, 3, 4].map((offset) => jurisdictions[(currentIndex + offset) % jurisdictions.length]);
  const h1 = page?.h1 || `Tim Hortons Menu in ${item.name}: Prices, Deals and Locations`;
  const excerpt = page?.excerpt || `Use this page to compare U.S. menu categories, observed starting prices, current promotional offers and verified Tim Hortons location cities for ${item.name}.`;
  const faq = [
    { q: `Does Tim Hortons have locations in ${item.name}?`, a: hasLocations ? `Yes. This directory currently contains ${locations.length} active ${locations.length === 1 ? "location entry" : "location entries"} for ${item.name}. Verify addresses and opening hours before traveling.` : `No active location is currently listed for ${item.name}. Check the official locator before traveling.` },
    { q: `Are Tim Hortons menu prices the same across ${item.name}?`, a: "No. Prices can vary by restaurant, franchise, size, service mode, tax and active promotion. The prices on this page are guidance rather than a guaranteed statewide price." },
    { q: `How can I find current Tim Hortons deals in ${item.name}?`, a: "Check the Tim Hortons app, official offer terms and the deals section on this site. Many offers require a rewards account or a participating restaurant." },
    { q: `When was this ${item.name} menu page reviewed?`, a: `The default menu and location snapshot was reviewed on ${DATA_REVIEWED}. CMS updates may be newer and are reflected after publication.` },
  ];
  const schema = [
    { "@context": "https://schema.org", "@type": "BreadcrumbList", itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: `${settings.site_url}/` },
      { "@type": "ListItem", position: 2, name: `${item.name} Tim Hortons Menu`, item: `${settings.site_url}/menu/${item.slug}` },
    ] },
    { "@context": "https://schema.org", "@type": "WebPage", name: h1, description: excerpt, url: `${settings.site_url}/menu/${item.slug}`, dateModified: page?.updated_at || "2026-07-18", isPartOf: { "@type": "WebSite", name: settings.site_name, url: settings.site_url }, about: ["Tim Hortons menu", `${item.name} restaurant availability`, "coffee prices", "breakfast menu"] },
    { "@context": "https://schema.org", "@type": "FAQPage", mainEntity: faq.map((entry) => ({ "@type": "Question", name: entry.q, acceptedAnswer: { "@type": "Answer", text: entry.a } })) },
    { "@context": "https://schema.org", "@type": "ItemList", name: `Tim Hortons location entries in ${item.name}`, numberOfItems: locations.length, itemListElement: locations.map((location, index) => ({ "@type": "ListItem", position: index + 1, name: location.address ? `${location.city} — ${location.address}` : location.city, url: location.official_url || undefined })) },
  ];

  return (
    <main>
      {schema.map((entry, index) => <script key={index} type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(entry) }} />)}
      <section className="state-hero"><div className="container">
        <nav className="breadcrumbs" aria-label="Breadcrumb"><Link href="/">Home</Link><span>/</span><span>{item.name}</span></nav>
        <p className="eyebrow">{item.region} menu guide</p><h1>{h1}</h1><p className="hero-copy">{excerpt}</p>
        <div className="state-meta"><span>Default review: {DATA_REVIEWED}</span><span>{hasLocations ? `${locations.length} active locations` : "Official availability check"}</span><span>Independent public guide</span></div>
      </div></section>

      <div className="container content-layout"><article>
        <section className="notice"><strong>Local pricing notice:</strong> Menu prices are set at restaurant level and may differ from the guidance below. Confirm the final price in the official app or at the selected restaurant.</section>
        <CmsBody body={editorialBody} />
        <AdSlot client={settings.adsense_client_id} slot={settings.adsense_article_slot} />
        <MenuTable categories={menu} />

        <section className="section-block"><h2>Current Tim Hortons deals for {item.name}</h2><div className="deal-grid">{deals.map((deal) => <article className="deal-card" key={deal.id}><h3>{deal.title}</h3><p>{deal.details}</p><small>{deal.status_text}</small></article>)}</div></section>

        <section className="section-block"><h2>Tim Hortons locations in {item.name}</h2>
          {hasLocations ? <><p>Review the active entries below and use official destination links to confirm exact hours, services and live availability.</p><div className="location-list">{locations.map((location) => <article className="location-card" key={location.id}><h3>{location.city}</h3>{location.address ? <p>{location.address}</p> : null}{location.phone ? <p>{location.phone}</p> : null}{location.official_url ? <a href={location.official_url} target="_blank" rel="nofollow noopener">Verify official listing</a> : null}</article>)}</div>{item.officialStateUrl ? <p><a className="text-link" href={item.officialStateUrl} target="_blank" rel="nofollow noopener">Open the official {item.name} location directory</a></p> : null}</>
          : <div className="empty-state"><h3>No active location currently listed</h3><p>No verified Tim Hortons location entry is currently active for {item.name}. The page remains a public menu and availability guide, while the official locator is the final source for newly opened restaurants.</p><a className="button secondary" href="https://locations.timhortons.com/en/" target="_blank" rel="nofollow noopener">Check official directory</a></div>}
        </section>

        <section className="section-block"><h2>{item.name} Tim Hortons menu FAQs</h2><div className="faq-list">{faq.map((entry) => <details key={entry.q}><summary>{entry.q}</summary><p>{entry.a}</p></details>)}</div></section>
        <section className="section-block"><h2>Explore other state menu pages</h2><div className="related-grid">{related.map((entry) => <Link key={entry.slug} href={`/menu/${entry.slug}`}>{entry.name} Tim Hortons Menu</Link>)}</div></section>
      </article><aside className="sidebar"><SubscribeForm /><AdSlot client={settings.adsense_client_id} slot={settings.adsense_sidebar_slot} /><div className="source-card"><h2>Editorial method</h2><p>Every state route includes at least 500 words of non-menu guidance. Location entries should link to an official source, and prices, seasonal products, and value offers must be reviewed before publication.</p><Link href="/editorial-policy">Read editorial policy</Link></div></aside></div>
    </main>
  );
}
