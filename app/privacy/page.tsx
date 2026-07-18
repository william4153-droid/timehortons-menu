import type { Metadata } from "next";
import StandardCmsPage from "@/components/StandardCmsPage";
import { getCmsPageByRoute } from "@/lib/cms";

export const revalidate = 300;
export async function generateMetadata(): Promise<Metadata> { const page = await getCmsPageByRoute("/privacy"); return { title: page?.meta_title || "Privacy Policy", description: page?.meta_description || "Privacy policy for email subscriptions, analytics and advertising.", robots: { index: page?.robots_index ?? true, follow: true }, alternates: { canonical: "/privacy" } }; }
export default async function PrivacyPage() { const page = await getCmsPageByRoute("/privacy"); return <StandardCmsPage page={page} fallbackH1="Privacy Policy" fallbackBody={<><h2>Email subscriptions</h2><p>When you subscribe, the site stores your email address, optional preferred state, subscription date and active status. This data is used for menu and deal updates.</p><h2>Unsubscribe and deletion</h2><p>Every newsletter should include an unsubscribe method. Subscriber records should be deleted or disabled promptly when requested.</p><h2>Analytics and advertising</h2><p>The production site may use Google Analytics and Google AdSense when enabled by the administrator. Update this policy with the final consent, cookie and regional compliance details before monetization.</p></>} />; }
