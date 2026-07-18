import Link from "next/link";
import { getSupabaseAdmin } from "@/lib/supabase/admin";

export const dynamic = "force-dynamic";

export default async function AdminDashboard() {
  const client = getSupabaseAdmin();
  const tables = ["cms_pages", "menu_items", "deals", "locations", "subscribers"] as const;
  const counts: Record<string, number> = {};
  if (client) {
    await Promise.all(tables.map(async (table) => {
      const { count } = await client.from(table).select("*", { count: "exact", head: true });
      counts[table] = count || 0;
    }));
  }
  return (
    <>
      <div className="admin-heading"><div><p className="eyebrow">Content control</p><h1>Admin dashboard</h1><p>Manage every public page, menu item, deal, location, subscription and Google integration from one panel.</p></div><Link className="button" href="/admin/pages/new">Add new page</Link></div>
      <section className="admin-stat-grid">
        <Link href="/admin/pages"><strong>{counts.cms_pages || 0}</strong><span>CMS pages</span></Link>
        <Link href="/admin/menu"><strong>{counts.menu_items || 0}</strong><span>Menu items</span></Link>
        <Link href="/admin/deals"><strong>{counts.deals || 0}</strong><span>Deals</span></Link>
        <Link href="/admin/locations"><strong>{counts.locations || 0}</strong><span>Locations</span></Link>
        <Link href="/admin/subscribers"><strong>{counts.subscribers || 0}</strong><span>Subscribers</span></Link>
      </section>
      <section className="admin-panel"><h2>Recommended launch order</h2><ol><li>Run <code>supabase/schema.sql</code> and <code>supabase/seed.sql</code>.</li><li>Create an Auth user and add the same email to Netlify <code>ADMIN_EMAILS</code>.</li><li>Save the live domain and Google IDs under Integrations.</li><li>Review state pages, prices, offers and official location links before indexing.</li></ol></section>
    </>
  );
}
