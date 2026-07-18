import AdminFlash from "@/components/AdminFlash";
import { getSiteSettings } from "@/lib/cms";
import { saveSettings } from "../actions";

export const dynamic = "force-dynamic";

export default async function AdminSettings({ searchParams }: { searchParams: Promise<{ message?: string; error?: string }> }) {
  const params = await searchParams;
  const settings = await getSiteSettings();
  return <>
    <div className="admin-heading"><div><p className="eyebrow">Tracking and monetization</p><h1>Google integrations</h1><p>Paste verified account IDs and tokens. The site injects them into the correct head, ad-slot and ads.txt locations.</p></div></div>
    <AdminFlash {...params} />
    <form action={saveSettings} className="admin-form admin-panel">
      <h2>Website identity</h2>
      <div className="admin-form-grid"><label>Site name<input name="site_name" defaultValue={settings.site_name} required /></label><label>Live site URL<input name="site_url" type="url" defaultValue={settings.site_url} required /></label></div>
      <label>Site tagline<input name="site_tagline" defaultValue={settings.site_tagline} /></label>
      <h2>Google Analytics 4</h2>
      <label>Measurement ID<input name="ga_measurement_id" defaultValue={settings.ga_measurement_id} placeholder="G-XXXXXXXXXX" /></label>
      <p className="field-help">Enter the GA4 Measurement ID only. The global site tag and page-view configuration are added automatically.</p>
      <h2>Google AdSense</h2>
      <div className="admin-form-grid"><label>Publisher client ID<input name="adsense_client_id" defaultValue={settings.adsense_client_id} placeholder="ca-pub-0000000000000000" /></label><label>ads.txt publisher ID<input name="ads_txt_publisher_id" defaultValue={settings.ads_txt_publisher_id} placeholder="pub-0000000000000000" /></label></div>
      <label className="check-label"><input type="checkbox" name="adsense_enabled" defaultChecked={settings.adsense_enabled} /> Enable AdSense script and configured ad units</label>
      <div className="admin-form-grid three"><label>Homepage slot<input name="adsense_home_slot" defaultValue={settings.adsense_home_slot} placeholder="1234567890" /></label><label>Article slot<input name="adsense_article_slot" defaultValue={settings.adsense_article_slot} /></label><label>Sidebar slot<input name="adsense_sidebar_slot" defaultValue={settings.adsense_sidebar_slot} /></label></div>
      <p className="field-help">Leave slot IDs empty when using Auto Ads only. The dynamic <code>/ads.txt</code> route uses your publisher ID.</p>
      <h2>Google Search Console</h2>
      <div className="admin-form-grid"><label>HTML tag verification content<input name="search_console_verification" defaultValue={settings.search_console_verification} placeholder="Token from content=..." /></label><label>Property URL<input name="search_console_property" defaultValue={settings.search_console_property} placeholder="https://example.com/" /></label></div>
      <p className="field-help">Paste only the value inside the Google verification meta tag’s <code>content</code> attribute. Submit <code>{settings.site_url}/sitemap.xml</code> inside Search Console after verification.</p>
      <button className="button" type="submit">Save integrations</button>
    </form>
  </>;
}
