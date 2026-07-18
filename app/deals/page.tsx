import type { Metadata } from "next";
import Link from "next/link";
import AdSlot from "@/components/AdSlot";
import CmsBody from "@/components/CmsBody";
import { getCmsPageByRoute, getDeals, getSiteSettings } from "@/lib/cms";
import { DATA_REVIEWED } from "@/lib/menu-data";

export const revalidate = 300;

export async function generateMetadata(): Promise<Metadata> {
  const page = await getCmsPageByRoute("/deals");
  return {
    title: page?.meta_title || "Tim Hortons Deals, Coupons and Offers USA",
    description: page?.meta_description || `Current Tim Hortons U.S. deal guidance, app offers and seasonal menu promotions. Reviewed ${DATA_REVIEWED}.`,
    alternates: { canonical: "/deals" },
    robots: { index: page?.robots_index ?? true, follow: true },
  };
}

export default async function DealsPage() {
  const [page, deals, settings] = await Promise.all([getCmsPageByRoute("/deals"), getDeals(), getSiteSettings()]);
  return <main><section className="state-hero"><div className="container"><p className="eyebrow">Offer tracker</p><h1>{page?.h1 || "Tim Hortons Deals, Coupons and Offers in the USA"}</h1><p className="hero-copy">{page?.excerpt || "Only publish an offer when it can be tied to an official announcement, offer-terms page or clearly identified participating restaurant."}</p></div></section><section className="container section prose"><AdSlot client={settings.adsense_client_id} slot={settings.adsense_article_slot} />
    <div className="deal-grid">{deals.map((deal) => <article className="deal-card" key={deal.id}><h2>{deal.title}</h2><p>{deal.details}</p><p><strong>Status:</strong> {deal.status_text}</p><small>{deal.source_text}</small></article>)}</div>
    {page?.body ? <CmsBody body={page.body} /> : <><h2>Coupon verification rules</h2><p>Third-party coupon codes are not treated as verified unless the offer can also be confirmed through Tim Hortons. Personalized app offers may not appear for every account. Always check expiration dates, minimum spend, participating restaurants, service-mode restrictions and product exclusions.</p></>}
    <p><Link className="text-link" href="/">Browse all state menu pages</Link></p></section></main>;
}
