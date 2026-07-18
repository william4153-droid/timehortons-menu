import type { Metadata } from "next";
import Script from "next/script";
import SiteChrome from "@/components/SiteChrome";
import GooglePageView from "@/components/GooglePageView";
import { getSiteSettings } from "@/lib/cms";
import "./globals.css";

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSiteSettings();
  const siteUrl = settings.site_url || process.env.NEXT_PUBLIC_SITE_URL || "https://example.com";
  return {
    metadataBase: new URL(siteUrl),
    title: { default: settings.site_name, template: `%s | ${settings.site_name}` },
    description: settings.site_tagline,
    openGraph: { type: "website", siteName: settings.site_name },
    verification: settings.search_console_verification ? { google: settings.search_console_verification } : undefined,
    other: settings.adsense_client_id ? { "google-adsense-account": settings.adsense_client_id } : undefined,
  };
}

export default async function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const settings = await getSiteSettings();
  const gaId = settings.ga_measurement_id.trim();
  const adsenseClient = settings.adsense_enabled ? settings.adsense_client_id.trim() : "";
  return (
    <html lang="en-US">
      <body>
        {adsenseClient ? <Script id="adsense" async strategy="beforeInteractive" crossOrigin="anonymous" src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${encodeURIComponent(adsenseClient)}`} /> : null}
        {gaId ? <>
          <Script async src={`https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(gaId)}`} strategy="afterInteractive" />
          <Script id="ga4" strategy="afterInteractive">{`window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('js',new Date());gtag('config','${gaId}',{anonymize_ip:true,send_page_view:false});`}</Script>
        </> : null}
        <GooglePageView measurementId={gaId} />
        <SiteChrome siteName={settings.site_name}>{children}</SiteChrome>
      </body>
    </html>
  );
}
