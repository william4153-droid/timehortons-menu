import AdminFlash from "@/components/AdminFlash";
import { getSupabaseAdmin } from "@/lib/supabase/admin";
import type { DealRecord } from "@/lib/types";
import { deleteDeal, saveDeal } from "../actions";

export const dynamic = "force-dynamic";

function DealForm({ deal }: { deal?: DealRecord }) {
  return <form action={saveDeal} className="admin-form deal-editor">
    <input type="hidden" name="id" value={deal?.id || ""} />
    <div className="admin-form-grid"><label>Deal title<input name="title" defaultValue={deal?.title || ""} required /></label><label>Display order<input name="sort_order" type="number" defaultValue={deal?.sort_order || 0} /></label></div>
    <label>Details<textarea name="details" rows={3} defaultValue={deal?.details || ""} required /></label>
    <div className="admin-form-grid"><label>Status / terms<input name="status_text" defaultValue={deal?.status_text || ""} /></label><label>Source note<input name="source_text" defaultValue={deal?.source_text || ""} /></label></div>
    <div className="admin-form-grid three"><label>Start date<input name="starts_at" type="date" defaultValue={deal?.starts_at?.slice(0, 10) || ""} /></label><label>End date<input name="ends_at" type="date" defaultValue={deal?.ends_at?.slice(0, 10) || ""} /></label><label className="check-label"><input type="checkbox" name="active" defaultChecked={deal?.active ?? true} /> Active</label></div>
    <button className="button" type="submit">{deal ? "Save deal" : "Add deal"}</button>
  </form>;
}

export default async function AdminDeals({ searchParams }: { searchParams: Promise<{ message?: string; error?: string }> }) {
  const params = await searchParams;
  const client = getSupabaseAdmin();
  const { data } = client ? await client.from("deals").select("*").order("sort_order") : { data: [] };
  const deals = (data || []) as DealRecord[];
  return <>
    <div className="admin-heading"><div><p className="eyebrow">Offers</p><h1>Deals and coupons</h1><p>Control current promotions, validity dates, terms and source notes.</p></div></div>
    <AdminFlash {...params} />
    <section className="admin-panel"><h2>Add a deal</h2><DealForm /></section>
    {deals.map((deal) => <section className="admin-panel" key={deal.id}><h2>{deal.title}</h2><DealForm deal={deal} /><form action={deleteDeal} className="mini-delete"><input type="hidden" name="id" value={deal.id} /><button type="submit">Delete deal</button></form></section>)}
  </>;
}
