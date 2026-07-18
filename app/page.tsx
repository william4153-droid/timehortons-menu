import type { Metadata } from "next";
import Link from "next/link";
import AdSlot from "@/components/AdSlot";
import CmsBody from "@/components/CmsBody";
import StateDirectory from "@/components/StateDirectory";
import SubscribeForm from "@/components/SubscribeForm";
import { getCmsPageByRoute, getDeals, getSiteSettings } from "@/lib/cms";
import { jurisdictions } from "@/lib/jurisdictions";
import { DATA_REVIEWED } from "@/lib/menu-data";

export const revalidate = 300;

export async function generateMetadata(): Promise<Metadata> {
  const page = await getCmsPageByRoute("/");
  return page ? {
    title: page.meta_title,
    description: page.meta_description,
    alternates: { canonical: "/" },
    robots: { index: page.robots_index, follow: true },
  } : {};
}

export default async function HomePage() {
  const [page, deals, settings] = await Promise.all([getCmsPageByRoute("/"), getDeals(), getSiteSettings()]);
  const activeCount = jurisdictions.filter((item) => item.hasVerifiedLocations).length;
  const h1 = page?.h1 || "Tim Hortons Menu Prices, Deals and Locations by State";
  const excerpt = page?.excerpt || "Explore menu price guidance, breakfast and drink categories, current value offers, and verified city coverage across all 50 states, Washington, D.C., and Puerto Rico.";
  const webSiteSchema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: settings.site_name,
    url: settings.site_url,
    description: settings.site_tagline,
  };

  return (
    <main>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(webSiteSchema) }} />
      <section className="hero"><div className="container hero-grid"><div>
        <p className="eyebrow">U.S. menu and location directory</p><h1>{h1}</h1><p className="hero-copy">{excerpt}</p>
        <div className="stat-row"><div><strong>52</strong><span>jurisdiction pages</span></div><div><strong>{activeCount}</strong><span>verified-location states</span></div><div><strong>{DATA_REVIEWED}</strong><span>last reviewed</span></div></div>
      </div><aside className="hero-card"><span className="badge">Price note</span><h2>Prices are not statewide</h2><p>Tim Hortons prices can change by restaurant, size, service mode, taxes and promotions. This guide shows observed starting prices and clearly labels items that need a local-store check.</p><Link className="button" href="/deals">View current deals</Link></aside></div></section>

      <div className="container"><AdSlot client={settings.adsense_client_id} slot={settings.adsense_home_slot} /></div>

      <section className="container section"><div className="section-heading"><div><p className="eyebrow">Browse the directory</p><h2>Tim Hortons Menu by State and Jurisdiction</h2></div><p>All 52 jurisdiction pages are public and indexable. Pages without a verified restaurant clearly state the availability status and link readers to the official locator instead of inventing a branch.</p></div><StateDirectory items={jurisdictions} /></section>

      <section className="section muted-section"><div className="container two-column"><div><p className="eyebrow">Current offer snapshot</p><h2>Deals and seasonal menu highlights</h2>{deals.slice(0, 2).map((deal) => <article className="deal-card" key={deal.id}><h3>{deal.title}</h3><p>{deal.details}</p><small>{deal.status_text}</small></article>)}</div><SubscribeForm /></div></section>

      <section className="container section prose">
        {page?.body ? <CmsBody body={page.body} /> : <><h2>How this menu guide is maintained</h2><p>Location coverage is checked against the official Tim Hortons U.S. directory. Menu categories are based on the U.S. ordering experience and official product announcements. Price examples are treated as guidance because a single restaurant chain can use different franchise, delivery and local-market pricing.</p><p>Every state page includes at least 500 words of non-menu guidance, a location-status summary, crawlable internal links, visible source methodology, FAQ content and structured data that matches the page text.</p></>}
      </section>
    </main>
  );
}
