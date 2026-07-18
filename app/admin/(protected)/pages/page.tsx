import Link from "next/link";
import AdminFlash from "@/components/AdminFlash";
import { getSupabaseAdmin } from "@/lib/supabase/admin";
import type { CmsPage } from "@/lib/types";

export const dynamic = "force-dynamic";

export default async function AdminPages({ searchParams }: { searchParams: Promise<{ message?: string; error?: string }> }) {
  const params = await searchParams;
  const client = getSupabaseAdmin();
  const { data } = client ? await client.from("cms_pages").select("*").order("route_path") : { data: [] };
  const pages = (data || []) as CmsPage[];
  return (
    <>
      <div className="admin-heading"><div><p className="eyebrow">CMS pages</p><h1>Pages</h1><p>Edit seeded state and system pages or create a new page at any available route.</p></div><Link className="button" href="/admin/pages/new">Add page</Link></div>
      <AdminFlash {...params} />
      <div className="admin-table-wrap"><table className="admin-table"><thead><tr><th>Page</th><th>Route</th><th>Type</th><th>Status</th><th>Index</th><th></th></tr></thead><tbody>
        {pages.map((page) => <tr key={page.id}><td><strong>{page.title}</strong><small>{page.updated_at ? `Updated ${new Date(page.updated_at).toLocaleString("en-US")}` : ""}</small></td><td><code>{page.route_path}</code></td><td>{page.page_type}</td><td><span className={`admin-pill ${page.status}`}>{page.status}</span></td><td>{page.robots_index ? "Yes" : "No"}</td><td><Link href={`/admin/pages/${page.id}`}>Edit</Link></td></tr>)}
      </tbody></table></div>
    </>
  );
}
