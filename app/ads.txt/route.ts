import { getSiteSettings } from "@/lib/cms";

export const revalidate = 300;

export async function GET() {
  const settings = await getSiteSettings();
  const publisherId = settings.ads_txt_publisher_id.trim();
  const content = publisherId ? `google.com, ${publisherId}, DIRECT, f08c47fec0942fa0\n` : "# AdSense publisher ID is not configured.\n";
  return new Response(content, { headers: { "content-type": "text/plain; charset=utf-8", "cache-control": "public, max-age=300" } });
}
