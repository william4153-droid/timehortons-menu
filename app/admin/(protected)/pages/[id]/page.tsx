import Link from "next/link";
import { notFound } from "next/navigation";
import AdminFlash from "@/components/AdminFlash";
import { getSupabaseAdmin } from "@/lib/supabase/admin";
import type { CmsPage } from "@/lib/types";
import { deletePage, savePage } from "../../actions";

const emptyPage: CmsPage = {
  id: "", page_type: "custom", route_path: "/guides/new-page", slug: "new-page", jurisdiction_slug: null,
  title: "", h1: "", excerpt: "", body: "", meta_title: "", meta_description: "", robots_index: true, status: "draft",
};

export const dynamic = "force-dynamic";

export default async function EditPage({ params, searchParams }: { params: Promise<{ id: string }>; searchParams: Promise<{ message?: string; error?: string }> }) {
  const { id } = await params;
  const flash = await searchParams;
  let page = emptyPage;
  if (id !== "new") {
    const client = getSupabaseAdmin();
    const { data } = client ? await client.from("cms_pages").select("*").eq("id", id).maybeSingle() : { data: null };
    if (!data) notFound();
    page = data as CmsPage;
  }
  return (
    <>
      <div className="admin-heading"><div><p className="eyebrow">{id === "new" ? "Create" : "Edit"}</p><h1>{id === "new" ? "New CMS page" : page.title}</h1><p>Changes become public after saving a published page.</p></div>{page.route_path ? <Link className="button secondary" href={page.route_path} target="_blank">Open page</Link> : null}</div>
      <AdminFlash {...flash} />
      <form action={savePage} className="admin-form admin-panel">
        <input type="hidden" name="id" value={page.id} />
        <div className="admin-form-grid three"><label>Page type<select name="page_type" defaultValue={page.page_type}><option value="custom">Custom</option><option value="state">State</option><option value="home">Home</option><option value="system">System</option></select></label><label>Route path<input name="route_path" defaultValue={page.route_path} required /></label><label>Jurisdiction slug<input name="jurisdiction_slug" defaultValue={page.jurisdiction_slug || ""} placeholder="new-york" /></label></div>
        <label>Internal title<input name="title" defaultValue={page.title} required /></label>
        <label>H1 heading<input name="h1" defaultValue={page.h1} required /></label>
        <label>Intro / excerpt<textarea name="excerpt" rows={3} defaultValue={page.excerpt} /></label>
        <label>Page body<textarea name="body" rows={14} defaultValue={page.body} placeholder={'Use blank lines for paragraphs. Start headings with "## ".'} /></label>
        <div className="admin-form-grid"><label>SEO title<input name="meta_title" defaultValue={page.meta_title} required maxLength={70} /></label><label>Meta description<textarea name="meta_description" rows={3} defaultValue={page.meta_description} required maxLength={170} /></label></div>
        <div className="admin-form-grid"><label>Status<select name="status" defaultValue={page.status}><option value="draft">Draft</option><option value="published">Published</option></select></label><label className="check-label"><input type="checkbox" name="robots_index" defaultChecked={page.robots_index} /> Allow search-engine indexing</label></div>
        <div className="admin-actions"><button className="button" type="submit">Save page</button><Link href="/admin/pages">Cancel</Link></div>
      </form>
      {page.page_type === "custom" && page.id ? <form action={deletePage} className="danger-zone"><input type="hidden" name="id" value={page.id} /><input type="hidden" name="route_path" value={page.route_path} /><div><strong>Delete custom page</strong><p>This permanently removes the page record.</p></div><button type="submit">Delete</button></form> : null}
    </>
  );
}
